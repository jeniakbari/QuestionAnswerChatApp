import { Request, Response } from "express";
import { Chat } from "../models/chatModel";
import { Op } from "sequelize";
import { AuthRequest } from "../middleware/authtokenMiddleware";
import { generateRoomId } from "../utility/roomUtils";


export class ChatController{
    // For API to get or create a chat session
    public  getOrCreateChatRoom = async (req: AuthRequest, res: Response) => {
    try {
      const { question_id, expert_user_id } = req.body;
      const normal_user_id = req.user.user_id;
  
      if (!question_id || !expert_user_id) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      const room_id = generateRoomId(question_id, normal_user_id, expert_user_id);
  
      // Check if chat messages exist
      const existingMessages = await Chat.findAll({
        where: { room_id },
        order: [['created_at', 'ASC']]
      });
  
      res.status(200).json({
        room_id,
        messages: existingMessages
      });
  
    } catch (error) {
      console.error("Error in getOrCreateChatRoom:", error);
      res.status(500).json({ error: "Server error while getting or creating chat room" });
    }
  };
}

