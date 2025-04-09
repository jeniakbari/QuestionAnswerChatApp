import { Router , Request, Response } from "express";
import { UserController } from "../controllers/userController";
import { authenticateToken } from "../middleware/authtokenMiddleware";


export class UserRoute extends UserController{
    public router: Router;
    constructor() {
        super();
        this.router = Router(); // Initialize the router instance
        this.route(); // Call route method to define endpoints
    }

    public route(){
        this.router.get("/profile",authenticateToken, async (req: Request, res: Response) => {
            try {
                await this.getProfile(req, res);
            } 
            catch (error) {
                res.status(500).json({ message: "Error in user getprofile route" });
            }
        });

        this.router.get("/coins",authenticateToken,async(req:Request, res:Response)=>{
            try {
                await this.getCoinBalance(req,res);
            }
            catch (error) {
                res.status(500).json({message:"Error in user getcoin route"+error})
            }
        })
        this.router.patch("/update",authenticateToken,async(req:Request, res:Response)=>{
            try {
                await this.updateProfile(req,res);
            }
            catch (error) {
                res.status(500).json({message:"Error in user updateprofile route"+error})
            }
        })
        this.router.get("/expert",async(req:Request, res:Response)=>{
            try {
                await this.getExperts(req,res);
            }
            catch (error) {
                res.status(500).json({message:"Error in user expertuser route"+error})
            }
        })
    }
}