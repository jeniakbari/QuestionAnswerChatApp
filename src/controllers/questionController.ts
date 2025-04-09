import { Request, Response } from "express";
import { User } from "../models/usersModel";
import { Question } from "../models/questionsModel";
import { Answer } from "../models/answersModel";
import { Comment } from "../models/commentsModel";
import { CoinsTransaction } from "../models/coinsTransactionModel";
import {AuthRequest} from "../middleware/authtokenMiddleware";
import { TransactionType } from "../core/transactionType";
import { UserType } from "../core/userType";
import { QuestionType } from "../core/questionType";
import { ExpertQuestionMap } from "../models/expertQuestionMapModel";
import { Sequelize,Op } from "sequelize";
import { Like } from "../models/likesModel";
import { error } from "console";

export class QuestionController{

    // Get All Public Questions Answers with comments
    public getPublicQuestions = async(req:AuthRequest, res:Response)=>{
        try {
            const { page = 1, limit = 10, tag,search} = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const where: any = {};
            // if(tag) where["tags"] = tag;
            if (search) where["title"] = {[Op.like]: `%${search}%`};
            where["visibility"]=QuestionType.PUBLIC; 

            // Fetch questions with pagination
            const questions = await Question.findAll({
                where,
                limit: Number(limit),
                attributes:["user_id","title","description"],
                include:[{
                    model:Answer,
                    attributes:["answer_id","content"],
                    include: [
                        {
                            model: Comment,
                            attributes: ["comment"]
                        },
                        {
                            model: User,
                            attributes: ["user_id", "first_name","last_name","user_role"]
                        }
                    ]
                }],
                offset,
            });

            res.json(questions);
        }
        catch(error){
            console.error("Error in getQuestions:", error);
            res.status(500).json({error:"Error GetQuestions controller"+error})
        }
    }

    // Get Private Questions for expert
    public getPrivateQuestions=async(req:AuthRequest,res:Response)=>{
        try {
            const { page = 1, limit = 10, tag,search} = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            if(req.user.user_role==UserType.EXPERT){
                return res.status(400).json({error:"Unauthorized to view this private questions"})
            }

            //  Get all question_ids assigned to this expert
            const expertMappings = await ExpertQuestionMap.findAll({
                where: { user_id: req.user.user_id },
                attributes: ['question_id']
            });
    
            const questionIds = expertMappings.map(mapping => mapping.question_id);
    
            if (questionIds.length === 0) {
                return res.status(200).json({ message: "No private questions assigned", questions: [] });
            }

             // Fetch only those questions
            const where: any = {
                question_id: { [Op.in]: questionIds },
                visibility: QuestionType.PRIVATE
               };

            if (search) {
                where["title"] = { [Op.like]: `%${search}%` };
            }       

            const question = await Question.findAll({
                where,
                limit: Number(limit),
                attributes:["user_id","title","description"],
                include:[{
                    model:Answer,
                    attributes:["answer_id","content"],
                    include:[{
                        model:Comment,
                        attributes:["comment"],
                    }]
                }],
                offset,
            });

            if (!question) return res.status(404).json({ error: "Question not found" });
            res.json(question);
        }
        catch(error){
            res.status(500).json({error:"Error Get Private Questions controller"+error})
        }
    }

     // Get Questions By user_id
    public getAllQuestionByUserId=async(req:AuthRequest,res:Response)=>{
        try {
            const { page = 1, limit = 10, tag,search} = req.query;
            const offset = (Number(page) - 1) * Number(limit);


            // const question = await Question.findAll({where:{user_id:req.user.user_id}})
            const question = await Question.findAll({
                where :{user_id:req.user.user_id},
                limit: Number(limit), 
                attributes: ["question_id", "user_id", "title", "description", "visibility"],
                include: [{
                    model: Answer,
                    attributes: ["answer_id", "content", "user_id"],
                    include: [
                        {
                            model: Comment,
                            attributes: ["comment"]
                        },
                        {
                            model: User,
                            attributes: ["user_id", "first_name","last_name","user_role"]
                        }
                    ]
                }],
                offset
            });
    

            if (!question) return res.status(404).json({ error: "Question not found" });
            res.json(question);
            
        }
        catch(error){
            res.status(500).json({error:"Error Get AllQuestionsByUserId controller"+error})
        }
    }
  
    // Add Question
    public addQuestion = async(req:AuthRequest, res:Response)=>{
        try {
            const user_id = req.user.user_id;
            const user = await User.findByPk(user_id);
            const {title , description} = req.body
            const visibility = req.body.visibility;

            if(!user){
                return res.status(400).json({message:"No such user found."})
            }
            if(user.user_role==UserType.EXPERT){
                return res.status(400).json({message:"You are expert user, you cannot ask question."})
            }
        
            if (typeof visibility !== "string") {
                return res.status(400).json({ message: "Invalid visibility type. Must be a string." });
            }
            const questionTypeKey = visibility.toUpperCase() as keyof typeof QuestionType;
        
            const questionType = QuestionType[questionTypeKey] as number;

            if (questionType === undefined) {
                return res.status(400).json({ message: "Invalid question type" });
            }

            if (!user || user.coins < 10) {
            return res.status(400).json({error: "Not enough coins"});
            }

            const question = await Question.create({
                user_id,
                title,
                description,
                visibility:questionType,
            })
            if(question){
                await user.decrement("coins", { by: 10 });
                await CoinsTransaction.create({ user_id, amount: "-10", transaction_type: TransactionType.ASK_QUESTION});
                res.status(201).json(question);

                // Assign expert users based on field for private questions
            if (questionType === QuestionType.PRIVATE) {
                const matchingExperts = await User.findAll({
                    where: {
                        user_role: UserType.EXPERT,
                        expertise: { [Op.contains]: [title] }
                    }
                });

                if (matchingExperts.length > 0) {
                    await ExpertQuestionMap.bulkCreate(
                        matchingExperts.map(expert => ({
                            question_id: question.question_id,
                            user_id: expert.user_id
                        }))
                    );}
                }
                return res.status(201).json(question);
            }
            return res.status(404).json({ error: "Question not added" });
        }
        catch(error){
            res.status(500).json({error:"Error Addquestions controller"+error})
        }
    }

    
    // Edit Question by creator only
    public editQuestion = async(req:AuthRequest, res:Response)=>{
        try {
            const question = await Question.findByPk(req.params.id);
            if (!question || question.user_id !== req.user.user_id) {
            return res.status(403).json({ error: "Unauthorized" });
            }
            await question.update(req.body);
            const updatedQuestion = await Question.findOne({ where: { question_id:req.params.id } });

            return res.status(200).json({ message: "Question updated successfully" , data:updatedQuestion});

        }
        catch(error){
            res.status(500).json({error:"Error EditQuestion controller"+error})
        }
    }

    // Delete Question by creator only
    public deleteQuestion = async(req:AuthRequest, res:Response)=>{
        try {
            const question = await Question.findByPk(req.params.id);
            if (!question || question.user_id !== req.user.user_id) {
                return res.status(403).json({ error: "Unauthorized" });
            }
            await question.destroy();
            res.status(200).json({message:"Question deleted"})
        }
        catch(error){
            res.status(500).json({error:"Error DeleteQuestion controller"+error})
        }
    }
}