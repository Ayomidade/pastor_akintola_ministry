// socket/chat.socket.js
import { ObjectId } from "mongodb";
import { chatMessages, chatSessions } from "../config/db.js";

export function initChatSocket(io) {
  const chatNsp = io.of("/chat");

  chatNsp.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Visitor or admin joins a session room
    socket.on("join_session", async ({ sessionId, role }) => {
      socket.join(sessionId);
      console.log(`${role} joined session: ${sessionId}`);

      // Mark session as active and read by admin if admin joined
      if (role === "admin") {
        await chatSessions().updateOne(
          { _id: new ObjectId(sessionId) },
          {
            $set: {
              isReadByAdmin: true,
              status: "active",
              updatedAt: new Date(),
            },
          },
        );
        // Notify all admin sockets to refresh unread count
        chatNsp.emit("unread_count_changed");
      }
    });

    // New message from either party
    socket.on(
      "send_message",
      async ({ sessionId, sender, senderName, message }) => {
        try {
          const newMessage = {
            sessionId: new ObjectId(sessionId),
            sender, // "visitor" | "admin"
            senderName,
            message,
            createdAt: new Date(),
          };

          const result = await chatMessages().insertOne(newMessage);
          const saved = { ...newMessage, _id: result.insertedId };

          // Broadcast to everyone in the session room
          chatNsp.to(sessionId).emit("receive_message", saved);

          // Update session's updatedAt and flip isReadByAdmin based on sender
          await chatSessions().updateOne(
            { _id: new ObjectId(sessionId) },
            {
              $set: {
                updatedAt: new Date(),
                // If visitor sent it, admin hasn't read it yet
                // If admin sent it, mark as read by admin
                isReadByAdmin: sender === "admin",
              },
            },
          );

          // If message is from visitor, ping the admin dashboard
          if (sender === "visitor") {
            chatNsp.emit("new_visitor_message", {
              sessionId,
              senderName,
              message,
            });
            chatNsp.emit("unread_count_changed");
          }
        } catch (err) {
          console.error("Socket send_message error:", err);
          socket.emit("error", { message: "Failed to send message." });
        }
      },
    );

    // Typing indicators
    socket.on("typing", ({ sessionId, sender }) => {
      socket.to(sessionId).emit("typing", { sender });
    });

    socket.on("stop_typing", ({ sessionId, sender }) => {
      socket.to(sessionId).emit("stop_typing", { sender });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
