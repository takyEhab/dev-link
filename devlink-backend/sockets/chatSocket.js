import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";
import Notification from "../models/notification.js";

const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf("=");
        return [
          cookie.slice(0, separator).trim(),
          decodeURIComponent(cookie.slice(separator + 1).trim()),
        ];
      }),
  );

export default function registerChatSocket(io) {
  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        cookies.token;

      if (!token) return next(new Error("Authentication required"));

      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.userId}`);

    socket.on(
      "join_conversation",
      async (conversationId, callback = () => {}) => {
        const conversation = await Chat.findConversationForUser(
          conversationId,
          socket.user.userId,
        );
        if (!conversation) return callback({ error: "Conversation not found" });

        socket.join(`conversation:${conversation.id}`);
        callback({ success: true });
      },
    );

    socket.on(
      "send_message",
      async ({ conversationId, content }, callback = () => {}) => {
        try {
          const conversation = await Chat.findConversationForUser(
            conversationId,
            socket.user.userId,
          );
          const cleanContent =
            typeof content === "string" ? content.trim() : "";

          if (!conversation)
            return callback({ error: "Conversation not found" });
          if (!cleanContent)
            return callback({ error: "Message cannot be empty" });
          if (cleanContent.length > 5000) {
            return callback({ error: "Message is too long" });
          }

          const message = await Chat.createMessage(
            conversation.id,
            socket.user.userId,
            cleanContent,
          );
          const recipientId = Chat.getOtherParticipant(
            conversation,
            socket.user.userId,
          );
          const notification = await Notification.create({
            userId: recipientId,
            actorId: socket.user.userId,
            type: "message",
            title: "New message",
            message: cleanContent,
            link: `/messages?conversation=${conversation.id}`,
          });
          io.to(`conversation:${conversation.id}`).emit("new_message", message);
          io.to(`user:${recipientId}`).emit("new_notification", notification);
          callback({ success: true, message });
        } catch {
          callback({ error: "Unable to send message" });
        }
      },
    );

    socket.on("mark_read", async (conversationId) => {
      const conversation = await Chat.findConversationForUser(
        conversationId,
        socket.user.userId,
      );
      if (conversation)
        await Chat.markRead(conversation.id, socket.user.userId);
    });
  });
}
