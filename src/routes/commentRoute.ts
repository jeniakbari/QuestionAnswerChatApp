import { Router , Request, Response } from "express";
import { authenticateToken } from "../middleware/authtokenMiddleware";
import { CommentController } from "../controllers/commentController";

export class CommentRoute extends CommentController{
    public router:Router;
    constructor(){
        super()
        this.router=Router()
        this.route()
    }
    public route(){
        this.router.post("/",async(req:Request,res:Response)=>{
            try {
                this.addComment(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in add comment route"+error})
            }
        })
        this.router.get("/:answerId",async(req:Request,res:Response)=>{
            try {
                this.getComments(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get comments route"+error})
            }
        })
    }
}