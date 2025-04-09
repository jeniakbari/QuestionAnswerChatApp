import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface LikeAttributes {
    like_id: number;
    answer_id: number;
    user_id: number;
    created_at: Date;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, "like_id"| "created_at"> {}

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    public like_id!: number;
    public answer_id!: number;
    public user_id!: number;
    public created_at!: Date;

    static associate(models: any) {
        Like.belongsTo(models.User, { foreignKey: "user_id" });
        Like.belongsTo(models.Answer, { foreignKey: "answer_id" });
    }
}
Like.init(
    {
        like_id: {
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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "likes",
        timestamps: false,
    }
);

export { Like };

