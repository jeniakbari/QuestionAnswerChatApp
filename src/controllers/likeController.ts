import { Request, Response } from "express";
import { User } from "../models/usersModel";
import { CoinsTransaction } from "../models/coinsTransactionModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { TransactionType } from "../core/transactionType";
import { Like } from "../models/likesModel";

export class LikeController{

    // Add like to answer
    public addLike = async (req: AuthRequest, res: Response) => {
        try {
            const alreadyliked = await Like.findAll({where:{answer_id: req.body.answer_id, user_id: req.user.user_id}})

            if(alreadyliked){
                return res.status(400).json({message:"You have already Liked this answer"});
            }

            const like = await Like.create({ answer_id: req.body.answer_id, user_id: req.user.user_id });
            const transactionType: TransactionType = req.body.transaction_type;

            if(like){
                await User.increment("coins", { by: 10, where: { user_id: req.user.user_id } });
                await CoinsTransaction.create({ user_id: req.user.user_id, amount: "+10", transaction_type: TransactionType.LIKE_ANSWER });    
            }
                    
            res.status(201).json(like);
        }
        catch(error){
            res.status(500).json({message:"Error in add like controller"+error})
        }
    }

    // Dislike the answer
    public disLike = async(req:AuthRequest,res:Response)=>{
        try {
            const Liked = await Like.findOne({ where: { answer_id: req.body.answer_id, user_id: req.user.user_id } });

            if (!Liked) {
                return res.status(400).json({ message: "You have not liked this answer yet." });
            }
    
            await Liked.destroy();
            // const transactionType: TransactionType = req.body.transaction_type;
    
            await User.decrement("coins", { by: 10, where: { user_id: req.user.user_id } });
            await CoinsTransaction.create({ user_id: req.user.user_id, amount: "-10", transaction_type: TransactionType.DISLIKE_ANSWER });    
    
            res.status(200).json({ message: "Like removed successfully." });
        } catch(error){
            res.status(500).json({message:"Error in dislike controller"+error})
        }
    }

    // Get likes count 
    public getLikes = async(req:AuthRequest, res:Response)=>{
        try {
            const likes = await Like.count({ where: { answer_id: req.params.answerId }});
            res.json({likes});
        }
        catch(error){
            res.status(500).json({message:"Error in get like controller"+error})
        }
    }
}