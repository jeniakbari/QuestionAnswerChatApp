import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { UserLoginLogs } from "../models/userLoginLogsModel";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
             res.status(401).json({message: "Access denied. No token provided."});
             return;
        }

        // If token is missing "Bearer ", assume it's a raw token and use it directly
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = decoded;
            return next();
        } catch (err: any) {
            if (err.name === "TokenExpiredError"){
                const expiredToken = jwt.decode(token) as { user_id?: number } | null;
                if (expiredToken?.user_id) {
                    await UserLoginLogs.update({ is_logout: 1 , logout_datetime:new Date()}, { where: { user_id: expiredToken.user_id } });
                }
                 res.status(401).json({ message: "Token expired. Please log in again." });
                 return;
            }
             res.status(403).json({ message: "Invalid token." });
             return;
        }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET as string,(err,user)=>{
        //     req.user=user;
        // });    
        // next();

    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
        return;
    }
};


