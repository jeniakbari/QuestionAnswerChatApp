import { Request, Response } from "express";
import { User } from "../models/usersModel";
import { CoinsTransaction } from "../models/coinsTransactionModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { Question } from "../models/questionsModel";
import { Answer } from "../models/answersModel";
import { Comment } from "../models/commentsModel";


export class CoinController{


    // get coin dashboard controller
    public getCoinDashboard = async (req: AuthRequest, res: Response) => {
        try {
            const user_id = req.user.user_id;
    
            const user = await User.findByPk(user_id, {
                attributes: ['user_id', 'first_name','last_name', 'coins']
            });
    
            if (!user) return res.status(404).json({ error: "User not found" });
    
            const [transactions, questions, answers, comments] = await Promise.all([
                CoinsTransaction.findAll({ where: { user_id }, order: [["created_at", "DESC"]] }),
                Question.findAll({ where: { user_id }, attributes: ['question_id', 'title', 'created_at'] }),
                Answer.findAll({ where: { user_id }, attributes: ['answer_id', 'question_id', 'created_at'] }),
                Comment.findAll({ where: { user_id }, attributes: ['comment_id', 'answer_id', 'created_at'] })
            ]);
    
            return res.status(200).json({
                user: {
                    firstname: user.first_name,
                    lastname: user.last_name,
                    coinBalance: user.coins
                },
                coinTransactions: transactions,
                activities: {
                    questionsAsked: questions,
                    answersGiven: answers,
                    commentsMade: comments
                }
            });
        } catch (error) {
            return res.status(500).json({ error: "Error fetching coin dashboard: " + error });
        }
    };  
    
    // get first 10 users with highest coins  
    public getLeaderboard = async (req: Request, res: Response) => {
     try {
           const users = await User.findAll({ order: [["coins", "DESC"]], limit: 10 });
           res.json(users);
        }
        catch(error){
            res.status(500).json({message:"Error in get users with highest coins controller"+error})
        }   
     }
}