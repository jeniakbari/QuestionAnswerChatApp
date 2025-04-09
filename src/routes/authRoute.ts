import { Router , Request, Response } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateToken } from "../middleware/authtokenMiddleware";

export class AuthRoute extends AuthController {
    public router: Router;
    constructor() {
        super();
        this.router = Router(); // Initialize the router instance
        this.route(); // Call route method to define endpoints
    }

    public route() {
    this.router.post("/register", async (req: Request, res: Response) => {
            try {
                await this.registerUser(req, res);
            } catch (error) {
                console.error("Error in register route:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    this.router.post("/login", async(req:Request, res:Response)=>{
        try {
            await this.loginUser(req, res);
        } catch (error) {
            console.error("Error in Login route:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })

    this.router.patch("/logout",authenticateToken, async(req:Request, res:Response)=>{
        try {
            await this.logoutUser(req, res);
        } catch (error) {
            console.error("Error in Logout route:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })

    this.router.post("/forgotpass", async(req:Request, res:Response)=>{
        try {
            await this.forgotPassword(req, res);
        } catch (error) {
            console.error("Error in Forgot Password route:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })
    this.router.post("/resetpass", async(req:Request, res:Response)=>{
        try {
            await this.resetPassword(req, res);
        } catch (error) {
            console.error("Error in Reset Password route:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })
    }
}


