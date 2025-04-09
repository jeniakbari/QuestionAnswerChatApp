import { Router , Request, Response } from "express";
import { authenticateToken } from "../middleware/authtokenMiddleware";
import { QuestionController } from "../controllers/questionController";


export class QuestionRoute extends QuestionController{
    public router : Router;
    constructor(){
        super()
        this.router = Router();
        this.route()
    }

    public route(){
        this.router.post("/",(req:Request, res:Response)=>{                                                                                                                                     
            try{
                this.addQuestion(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in question add route"+error})
            }
        })
        this.router.get("/private",(req:Request, res:Response)=>{                                                                                                                                     
            try{
                this.getPrivateQuestions(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get private question route"+error})
            }
        })
        this.router.get("/user",(req:Request, res:Response)=>{                                                                                                                                     
            try{
                this.getAllQuestionByUserId(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get private question route"+error})
            }
        })
        this.router.get("/",(req:Request, res:Response)=>{
            try{
                this.getPublicQuestions(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in question get route"+error})
            }
        })
        // this.router.get("/:id",(req:Request, res:Response)=>{
        //     try{
        //         this.getQuestionById(req,res);
        //     }
        //     catch(error){
        //         res.status(500).json({message:"Error in question get route"+error})
               
        //     }
        // })
        this.router.patch("/:id",(req:Request, res:Response)=>{
            try{
                this.editQuestion(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in question edit route"+error})
               
            }
        })
        this.router.delete("/:id",(req:Request, res:Response)=>{
            try{
                this.deleteQuestion(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in question delete route"+error})         
            }
        })
    }
}