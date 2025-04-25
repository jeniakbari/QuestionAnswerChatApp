import { Server, Socket } from "socket.io";
import { Chat } from "../models/chatModel";
import { generateRoomId } from "../utility/roomUtils";


export const initChatSocket = (io: Server) => {
  // io.use(authenticateUserSocket);

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    // console.log(`User connected: ${user.user_id}`);
    console.log("user connected");

    // Join a chat room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${user.user_id} joined room: ${roomId}`);
    });

      // // Send and receive messages
  socket.on("send_message", async (data) => {

    try {
      const { question_id, receiver_id, content } = data;
      const room_id = generateRoomId(question_id, user.user_id, receiver_id);

      const savedMessage = await Chat.create({
        question_id,
        sender_id: user.user_id,
        receiver_id,
        room_id,
        content
      });

      io.to(room_id).emit("receive_message", savedMessage);
    } catch (err) {
    console.error("Error saving message:", err);
    }
  });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.user_id}`);
    });
  });
};

