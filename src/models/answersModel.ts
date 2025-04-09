import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface AnswerAttributes {
    answer_id: number;
    question_id: number;
    user_id: number;
    content: string;
    created_at: Date;
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, "answer_id"| "created_at"> {}

class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
    public answer_id!: number;
    public question_id!: number;
    public user_id!: number;
    public content!: string;
    public created_at!: Date;

    static associate(models: any) {
        Answer.belongsTo(models.User, { foreignKey: "user_id" });
        Answer.belongsTo(models.Question, { foreignKey: "question_id" });
        Answer.hasMany(models.Comment,{foreignKey:"answer_id"});
    }

}
Answer.init(
    {
        answer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "answers",
        timestamps: false,
    }
);

export { Answer };


