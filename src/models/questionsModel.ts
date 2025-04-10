import {Sequelize, DataTypes,Model, Optional} from "sequelize";
import sequelize from "./dbConfig";


interface QuestionAttributes{
    question_id:number,
    user_id:number,
    title:string,
    description:string,
    visibility:number,
    created_at:Date
}

interface QuestionCreationAttrinbutes extends Optional<QuestionAttributes, "question_id"| "created_at"> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttrinbutes> implements QuestionAttributes{
    public question_id!:number;
    public user_id!:number;
    public title!:string;
    public description!:string;
    public visibility!:number;
    public created_at!:Date;

    static associate(models: any){
        Question.belongsTo(models.User, {foreignKey: "user_id" });
        Question.hasMany(models.Answer,{foreignKey:"question_id"});
        Question.hasMany(models.ExpertQuestionMap, { foreignKey: "question_id" });
        Question.hasMany(models.Chat, { foreignKey: "question_id"});

    }
}

Question.init({
    question_id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                },
                user_id: {
                    type:DataTypes.INTEGER,
                    allowNull: false,
                },
                title:{ 
                    type:DataTypes.STRING(500),
                    allowNull: false,
                },
                description: {
                    type:DataTypes.TEXT,
                    allowNull: false,
                },
                visibility:{
                    type:DataTypes.INTEGER,
                    allowNull:false,
                    defaultValue:0
                },
                created_at: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW
                },   
            },
            {
                sequelize,
                tableName: 'questions',
                timestamps: false,
            }
);

export {Question}

