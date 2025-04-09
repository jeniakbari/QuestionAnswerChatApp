import { Router , Request, Response } from "express";
import { AnswerController } from "../controllers/answerController";

export class AnswerRoute extends AnswerController{
    public router:Router;
    constructor(){
        super()
        this.router=Router();
        this.route()
    }

    public route(){
        this.router.post("/",async(req:Request,res:Response)=>{
            try {
                this.addAnswer(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in add answer route"+error})
            }
        })
        this.router.get("/:questionId",async(req:Request,res:Response)=>{
            try {
                this.getAnswers(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get answer route"+error})
            }
        })
        this.router.patch("/:id",async(req:Request,res:Response)=>{
            try {
                this.updateAnswer(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in update answer route"+error})
            }
        })
        this.router.delete("/:id",async(req:Request,res:Response)=>{
            try {
                this.deleteAnswer(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in delete answer route"+error})
            }
        })
    }
}
