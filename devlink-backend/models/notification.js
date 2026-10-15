import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
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

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

const mapNotification = (doc) => {
  if (!doc) return null;
  const n = doc.toObject ? doc.toObject() : doc;
  const actor = n.actor;
  return {
    id: n._id?.toString() || n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    isRead: Boolean(n.read_at),
    createdAt: n.created_at,
    actor: actor && typeof actor === "object"
      ? { id: actor._id?.toString() || actor.id, name: actor.name }
      : null,
  };
};

const Notification = {
  async listForUser(userId) {
    const list = await NotificationModel.find({ user: userId })
      .populate("actor", "name")
      .sort({ created_at: -1 })
      .limit(50);

    return list.map(mapNotification);
  },

  async unreadCount(userId) {
    const count = await NotificationModel.countDocuments({
      user: userId,
      read_at: null,
    });
    return count;
  },

  async create({ userId, actorId, type, title, message, link }) {
    const doc = await NotificationModel.create({
      user: userId,
      actor: actorId || null,
      type,
      title,
      message,
      link: link || null,
    });

    const populated = await NotificationModel.findById(doc._id).populate(
      "actor",
      "name"
    );

    return mapNotification(populated);
  },

  async markAllRead(userId) {
    await NotificationModel.updateMany(
      { user: userId, read_at: null },
      { $set: { read_at: new Date() } }
    );
  },
};

export { NotificationModel };
export default Notification;
