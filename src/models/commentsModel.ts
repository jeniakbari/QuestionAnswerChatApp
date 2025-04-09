import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface CommentAttributes {
    comment_id: number;
    answer_id: number;
    user_id: number;
    comment: string;
    created_at: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "comment_id"| "created_at"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public comment_id!: number;
    public answer_id!: number;
    public user_id!: number;
    public comment!: string;
    public created_at!: Date;

    static associate(models: any) {
        Comment.belongsTo(models.User, { foreignKey: "user_id" });
        Comment.belongsTo(models.Answer, { foreignKey: "answer_id" });
    }
}
Comment.init(
    {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        answer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
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
        tableName: "comments",
        timestamps: false,
    }
);

export { Comment };


