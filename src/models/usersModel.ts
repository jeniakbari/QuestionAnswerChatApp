import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from './dbConfig';


interface UserAttributes {
    user_id: number;
    first_name: string;
    last_name: string;
    user_role: number;
    password: string;
    email: string;
    coins: number;
    expertise: string[];
    created_at: Date;
    updated_at: Date;
    is_deleted: number;
    resetToken:String;
    resetTokenExpiresAt: Date;
}

// Optional attributes for Sequelize's `.create()` method
interface UserCreationAttributes extends Optional<UserAttributes, "user_id" | "coins" |"expertise"|"user_role" | "created_at" | "updated_at" | "is_deleted"|"resetToken"|"resetTokenExpiresAt"> {}


// Extend Sequelize Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public user_id!: number;
    public first_name!: string;
    public last_name!: string;
    public user_role!: number;
    public password!: string;
    public email!: string;
    public coins!: number;
    public expertise!: string[];
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: number;
    public resetToken!: String;
    public resetTokenExpiresAt!: Date;


    static associate(models: any) {
        User.hasMany(models.UserLoginLogs, { foreignKey: "user_id" });
        User.hasMany(models.Question, { foreignKey: "user_id"});
        User.hasMany(models.Answer, { foreignKey: "user_id"});
        User.hasMany(models.Comment, { foreignKey: "user_id"});
        User.hasMany(models.Like, { foreignKey: "user_id"});
        User.hasMany(models.CoinsTransaction, { foreignKey: "user_id"});
        User.hasMany(models.ExpertQuestionMap, { foreignKey: "question_id" });
        User.hasMany(models.Chat, { foreignKey: "sender_id",as: "sentMessages"});
        User.hasMany(models.Chat, { foreignKey: "receiver_id",as: "receivedMessages"});
    }

}

// Initialize User model
User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        user_role: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: {
                name: 'unique_email',
                msg: 'Email must be unique',
              },
        },
        coins:{
            type: DataTypes.INTEGER,
            defaultValue:100
        },
        expertise: {
            type: DataTypes.JSON, 
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        is_deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        resetTokenExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize, // Connection instance
        tableName: "users", // Table name
        timestamps: false, // No createdAt & updatedAt fields
    });


export { User };


