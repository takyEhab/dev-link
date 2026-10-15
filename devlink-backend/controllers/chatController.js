import Chat from "../models/chat.js";
import Notification from "../models/notification.js";

const getConversationId = (req) => req.params.conversationId;

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Chat.listConversations(req.user.userId);
    res.json({ success: true, data: { conversations } });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const participantId = req.body.participantId;
    if (!participantId || String(participantId) === String(req.user.userId)) {
      return res
        .status(400)
        .json({ error: "A valid other participant is required" });
    }

    if (!(await Chat.userExists(participantId))) {
      return res.status(404).json({ error: "Participant not found" });
    }

    const conversation = await Chat.findOrCreateConversation(
      req.user.userId,
      participantId,
    );
    res.status(201).json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conversationId = getConversationId(req);
    const conversation = await Chat.findConversationForUser(
      conversationId,
      req.user.userId,
    );
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    await Chat.markRead(conversationId, req.user.userId);
    const messages = await Chat.listMessages(conversationId, req.user.userId);
    res.json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};
export const sendMessage = async (req, res, next) => {
  try {
    const conversationId = getConversationId(req);
    const content =
      typeof req.body.content === "string" ? req.body.content.trim() : "";
    const conversation = await Chat.findConversationForUser(
      conversationId,
      req.user.userId,
    );

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });
    if (!content)
      return res.status(400).json({ error: "Message cannot be empty" });
    if (content.length > 5000) {
      return res.status(400).json({ error: "Message is too long" });
    }

    const message = await Chat.createMessage(
      conversationId,
      req.user.userId,
      content,
    );
    await Notification.create({
      userId: Chat.getOtherParticipant(conversation, req.user.userId),
      actorId: req.user.userId,
      type: "message",
      title: "New message",
      message: content,
      link: `/messages?conversation=${conversationId}`,
    });
    res.status(201).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

export const markConversationRead = async (req, res, next) => {
  try {
    const conversationId = getConversationId(req);
    const conversation = await Chat.findConversationForUser(
      conversationId,
      req.user.userId,
    );
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    await Chat.markRead(conversationId, req.user.userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
