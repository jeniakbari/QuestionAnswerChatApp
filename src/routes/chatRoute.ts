import { Router , Request, Response } from "express";
import { ChatController } from "../controllers/chatController";

export class ChatRoute extends ChatController{
    public router:Router;
    constructor(){
        super()
        this.router=Router();
        this.route()
    }
    public route(){
        this.router.get("/room",async(req:Request, res:Response)=>{
            try {
                this.getOrCreateChatRoom(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get chat history route"+error})
            }
        })
    }
    
}