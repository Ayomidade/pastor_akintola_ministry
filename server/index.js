import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server.js";
import { connectDB } from "./config/db.js";
import { initChatSocket } from "./socket/chat.socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initChatSocket(io);

// connectDB().then(() => {
//   httpServer.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer()