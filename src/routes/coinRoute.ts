import { Router , Request, Response } from "express";
import { authenticateToken } from "../middleware/authtokenMiddleware";
import { CoinController } from "../controllers/coinController";

export class CoinRoute extends CoinController{
    public router:Router;
    constructor(){
        super()
        this.router=Router();
        this.route()
    }
    public route(){
        this.router.get("/dashboard",async(req:Request, res:Response)=>{
            try {
                this.getCoinDashboard(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get coin balance route"+error})
            }
        })
        this.router.get("/leaderboard",async(req:Request, res:Response)=>{
            try {
                this.getLeaderboard(req,res);
            }
            catch(error){
                res.status(500).json({message:"Error in get coin leaderboard route"+error})
            }  
        })
    }
    
}