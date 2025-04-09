import { Request, Response } from "express";
import { User } from "../models/usersModel";
import { CoinsTransaction } from "../models/coinsTransactionModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { TransactionType } from "../core/transactionType";
import { Answer } from "../models/answersModel";
import { UserType } from "../core/userType";

export class AnswerController{
    public addAnswer = async(req:AuthRequest, res:Response)=>{
        try {
            // console.log("User role is: ",req.user.user_role)
            if (req.user.user_role !== UserType.EXPERT) {
                return res.status(403).json({ error: "Only experts can answer" });
            }
            const user_id = req.user.user_id;
            const user = await User.findByPk(user_id);

            if (!user) {
            return res.status(400).json({ error: "Not an user"});
            }

            const answer = await Answer.create({ ...req.body, user_id });
            if(answer){
                await user.increment("coins", { by: 50 });
                await CoinsTransaction.create({ user_id, amount: "+50", transaction_type: TransactionType.ADD_ANSWER});
                res.status(201).json(answer);
            }
            else{
                return res.status(404).json({ error: "Answer not added" });
            }
        }
        catch(error){
            res.status(500).json({error:"Error AddAnswer controller"+error})
        }
    }

    public getAnswers = async (req: Request, res: Response) => {
    try {
        const answers = await Answer.findAll({ where: { question_id: req.params.questionId }});
        res.json(answers);
    }
    catch(error){
        res.status(500).json({error:"Error Get Anwer(for specific question) controller"+error})
    }
    }

    public updateAnswer = async (req: AuthRequest, res: Response) => {
    try {
        const answer = await Answer.findByPk(req.params.id);
        if (!answer || answer.user_id !== req.user.user_id) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      
        await answer.update(req.body);
        const updatedAnswer = await Answer.findOne({ where: { answer_id:req.params.id } });
        
        return res.status(200).json({ message: "Answer updated successfully" , data:updatedAnswer});
        // res.json({ message: "Answer updated" });
    }
    catch(error){
        res.status(500).json({error:"Error Edit Answer controller"+error})
    }
    };
  
    public deleteAnswer = async (req: AuthRequest, res: Response) => {
        try {
            const answer = await Answer.findByPk(req.params.id);
            if (!answer || (req.user.user_role !== UserType.EXPERT)) {
              return res.status(403).json({ error: "Unauthorized" });
            }
          
            await answer.destroy();
            res.json({ message: "Answer deleted" });
        }
        catch(error){
            res.status(500).json({error:"Error Delete Answer controller"+error})
        }
      }
}
