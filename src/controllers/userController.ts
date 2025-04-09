import { Request, Response } from "express";
import { User } from "../models/usersModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { Question } from "../models/questionsModel";
import { Answer } from "../models/answersModel";
import { Comment } from "../models/commentsModel";
import { UserType } from "../core/userType";

export class UserController{

    // Get User Profile.
    public getProfile = async (req: AuthRequest, res: Response) => {
        try{

            const user_id = req.user.user_id;

            const user = await User.findByPk(user_id, {
            attributes: ['user_id', 'first_name','last_name', 'email', 'user_role', 'coins']
            });

            if (!user) return res.status(404).json({ error: "User not found" });

            const [questions, answers, comments] = await Promise.all([
                Question.findAll({ where: { user_id } }),
                Answer.findAll({ where: { user_id } }),
                Comment.findAll({ where: { user_id } })
            ]);

            return res.status(200).json({
                user,
                questionsAsked: questions,
                answersGiven: answers,
                commentsMade: comments
            });
        }
        catch(error){
            res.status(500).json({error:"Error in User Getprofile controller"+error})
        }
      };
      
    // Update User Profile.
    public updateProfile = async (req: AuthRequest, res: Response) => {
        try {
            // const { id } = req.params;
            const id = req.user.user_id; 
            const [updatedRows] = await User.update(req.body, {
            where: { user_id:id },
            });

            if (updatedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
            }
            const updatedUser = await User.findOne({ where: { user_id: id } });

            return res.status(200).json({ message: "User updated successfully" , data:updatedUser});
        }
        catch (error) {
            res.status(500).json({error:"Error in User Updateprofile Controller"+error})
        }
      };
      
    // Get Coin Balance .  
    public getCoinBalance = async (req: AuthRequest, res: Response) => {
        try {
            // const {id} = req.params;
            const id = req.user.user_id;
            const user = await User.findByPk(id);
            res.json({ coins: user?.coins});
        } 
        catch (error) {
            res.status(500).json({error:"Error in User Getcoin Controller"+error})
        }
      };
    
    // Get Expert Users.
    public getExperts = async (req: Request, res: Response) => {
        try {
            const experts = await User.findAll({ where: { user_role: UserType.EXPERT} });
            res.json(experts);
        }
        catch (error){
            res.status(500).json({error:"Error in User Getexperts Controller"+error})
        }
      };
}