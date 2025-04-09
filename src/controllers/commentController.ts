import { Request, Response } from "express";
import { User } from "../models/usersModel";
import { CoinsTransaction } from "../models/coinsTransactionModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { TransactionType } from "../core/transactionType";
import { Comment } from "../models/commentsModel";
import { UserType } from "../core/userType";

export class CommentController{
   
    // Add Comment
    public addComment = async (req: AuthRequest, res: Response) => {
    try {

        const comment = await Comment.create({ ...req.body, user_id: req.user.user_id });
        // const transactionType: TransactionType = req.body.transaction_type;
        if(comment){
            if(req.user.user_role==UserType.NORMAL){
                await User.increment("coins", { by: 20, where: { user_id: req.user.user_id } });
                await CoinsTransaction.create({ user_id: req.user.user_id, amount: "+20", transaction_type: TransactionType.COMMENT_ANSWER});
            }
            else{
                await User.increment("coins", { by: 30, where: { user_id: req.user.user_id } });
                await CoinsTransaction.create({ user_id: req.user.user_id, amount: "+30", transaction_type: TransactionType.EXPERT_COMMENT_ANSWER});
            }
            
        }
        
        res.status(201).json(comment);
    }
    catch(error){
        res.status(500).json({message:"Error in add comment controller"+error})
    }
  };

  // Get all Comments of an specific answer
  public getComments = async(req:AuthRequest, res:Response)=>{
    try {
        const comments = await Comment.findAll({ where: { answer_id: req.params.answerId } });
        res.json(comments);
    }
    catch(error){
        res.status(500).json({message:"Error in get comment controller"+error})
    }
  }
}