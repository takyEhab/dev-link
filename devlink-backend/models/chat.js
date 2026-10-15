import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

conversationSchema.index({ participants: 1 });

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

const mapMessage = (msg, currentUserId) => {
  const m = msg.toObject ? msg.toObject() : msg;
  const senderId = m.sender?._id?.toString() || m.sender?.toString();
  return {
    id: m._id?.toString() || m.id,
    conversationId: m.conversation?._id?.toString() || m.conversation?.toString(),
    senderId,
    sender: String(senderId) === String(currentUserId) ? "me" : "other",
    content: m.content,
    timestamp: m.created_at || m.createdAt,
    status: m.read_at ? "read" : "sent",
  };
};

const Chat = {
  async userExists(userId) {
    const User = mongoose.model("User");
    const exists = await User.exists({ _id: userId });
    return Boolean(exists);
  },

  async findOrCreateConversation(firstUserId, secondUserId) {
    const User = mongoose.model("User");
    const Profile = mongoose.model("Profile");

    let conv = await Conversation.findOne({
      participants: { $all: [firstUserId, secondUserId], $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: [firstUserId, secondUserId],
        lastMessageAt: new Date(),
      });
    }

    const otherUser = await User.findById(secondUserId);
    const otherProfile = await Profile.findOne({ user: secondUserId });

    return {
      id: conv._id.toString(),
      participant_one_id: firstUserId.toString(),
      participant_two_id: secondUserId.toString(),
      other_id: secondUserId.toString(),
      other_name: otherUser?.name || "Developer",
      other_title: otherProfile?.title || "Developer",
      created_at: conv.created_at,
      updated_at: conv.updated_at,
    };
  },

  async findConversationForUser(conversationId, userId) {
    try {
      const conv = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conv) return null;

      const p1 = conv.participants[0]?.toString();
      const p2 = conv.participants[1]?.toString();

      return {
        id: conv._id.toString(),
        participant_one_id: p1,
        participant_two_id: p2,
        participants: conv.participants.map((p) => p.toString()),
      };
    } catch {
      return null;
    }
  },

  getOtherParticipant(conversation, userId) {
    const p1 = conversation.participant_one_id || conversation.participants?.[0];
    const p2 = conversation.participant_two_id || conversation.participants?.[1];
    return String(p1) === String(userId) ? String(p2) : String(p1);
  },

  async listConversations(userId) {
    const User = mongoose.model("User");
    const Profile = mongoose.model("Profile");

    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ lastMessageAt: -1, updated_at: -1 });

    return Promise.all(
      conversations.map(async (c) => {
        const otherId = c.participants.find(
          (p) => p.toString() !== userId.toString()
        );

        const otherUser = otherId ? await User.findById(otherId) : null;
        const otherProfile = otherId ? await Profile.findOne({ user: otherId }) : null;

        const unreadCount = await Message.countDocuments({
          conversation: c._id,
          sender: { $ne: userId },
          read_at: null,
        });

        const latestMsg = await Message.findOne({ conversation: c._id }).sort({
          created_at: -1,
        });

        return {
          id: c._id.toString(),
          otherUserId: otherId?.toString(),
          name: otherUser?.name || "Developer",
          avatar: otherProfile?.avatar || null,
          role: otherProfile?.title || "Developer",
          company: "",
          lastMessage: latestMsg?.content || c.lastMessage || "No messages yet",
          timestamp: latestMsg?.created_at || c.lastMessageAt || c.updated_at,
          unread: unreadCount,
          online: false,
        };
      })
    );
  },

  async listMessages(conversationId, userId) {
    const messages = await Message.find({
      conversation: conversationId,
    }).sort({ created_at: 1 });

    return messages.map((m) => mapMessage(m, userId));
  },

  async createMessage(conversationId, senderId, content) {
    const msg = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    return mapMessage(msg, senderId);
  },

  async markRead(conversationId, userId) {
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        read_at: null,
      },
      {
        $set: { read_at: new Date() },
      }
    );
  },
};

export { Conversation, Message };
export default Chat;
