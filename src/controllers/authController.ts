import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel";
import { UserLoginLogs } from "../models/userLoginLogsModel"; 
import { sendEmail } from "../utility/sendEmail";
import * as uuid from "uuid";
import { Sequelize,Op } from "sequelize";
import {UserType} from "../core/userType";

export class AuthController{

 public registerUser = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password,user_role,expertise } = req.body;

        if(typeof user_role!=="string"){
            return res.status(400).json({message:"User Role is not of type String"})
        }
        const userTypeKey = user_role.toUpperCase() as keyof typeof UserType;
        const userType = UserType[userTypeKey] as number;
        if (userType === undefined) {
            return res.status(400).json({ message: "Invalid question type" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser){
            return res.status(400).json({message: "User already exists"});
        }

         // If user is an expert, expertise must be provided
        if (userType === UserType.EXPERT && !expertise) {
            return res.status(400).json({ error: "Expertise is required for expert users" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            user_role:userType,
            expertise :userType === UserType.EXPERT? expertise : null,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                user_id: newUser.user_id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

 public loginUser = async(req:Request, res:Response)=>{
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

         // Check if user already has an active session
         const activeSession = await UserLoginLogs.findOne({
            where: {
                user_id: user.user_id,
                is_logout: 0, // Not logged out
                access_token_expiration_datetime: { [Op.gt]: new Date() }, // Not expired
            },
        });

        if (activeSession) {
            return res.status(403).json({ message: "You are already logged in. Logout first to login again." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ user_id: user.user_id,user_role:user.user_role }, process.env.JWT_SECRET as string, { expiresIn: '2d'});
        // console.log(token)

        if(token){
            const { exp } = jwt.verify(token, process.env.JWT_SECRET as string) as { exp: number };

            const userloginlogs = await UserLoginLogs.create({
                user_id:user.user_id,
                access_token:token,
                access_token_expiration_datetime:new Date(exp * 1000),
            }) 
            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
            });
        }

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
 }
 
 public logoutUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const logout = await UserLoginLogs.update({
        is_logout:1,
        logout_datetime:new Date()
    },{
        where:{access_token:token}
    })
    if (logout[0] === 0) {
        return res.status(400).json({ message: "Invalid session or already logged out." });
    }
    res.json({ message: "Logged out successfully" });
  };

  public forgotPassword = async(req:Request, res:Response)=>{
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Generate a temporary reset token
        const resetToken = uuid.v4();
        const reset_exp = Number(process.env.RESET_TOKEN_EXPIRY) || 3000000;
        const expiresAt = new Date(Date.now() + reset_exp);

        await user.update({ resetToken, resetTokenExpiresAt:expiresAt});

        const resetLink = `https://QAapp.com/reset-password?token=${resetToken}`;
        const templateData={
            message:`Click here to reset your password: ${resetLink}`
        }
        sendEmail(email, "Password Reset", templateData);
    
        res.json({ message: "Password reset link sent to your email" ,token:resetToken});
      } 
      catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
  }
  public resetPassword = async(req:Request, res:Response)=>{
    try {
        const { token, newPassword } = req.body;
        // console.log("Token is ",token)
        // console.log("New Password is ",newPassword)
        // Find user by reset token
        const user = await User.findOne({ where: { resetToken: token } });

        if (!user || !user.resetTokenExpiresAt || new Date() > user.resetTokenExpiresAt) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // console.log("Hashed Password",hashedPassword)
        await user.update({ 
            password: hashedPassword, 
            resetToken: null as any, 
            resetTokenExpiresAt: null as any
        });
    
    
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        // res.status(500).json({ error: "Something went wrong" });
        res.status(500).json({error:error})
      }
  }
 
}
