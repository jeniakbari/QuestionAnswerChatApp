import { Router , Request, Response } from "express";
import { authenticateToken } from "../middleware/authtokenMiddleware";
import { LikeController } from "../controllers/likeController";

export class LikeRoute extends LikeController{
    public router:Router;
    constructor(){
        super();
        this.router = Router();
        this.route()
    }

    public route(){
        this.router.post("/",async(req:Request, res:Response)=>{
            try {
                this.addLike(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in add like route"+error})
            }
        })
        this.router.get("/:answerId",async(req:Request, res:Response)=>{
            try {
                this.getLikes(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get like route"+error})
            }
        })
    }
}