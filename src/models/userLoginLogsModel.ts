import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface UserLoginLogsAttributes {
    user_login_log_id: number;
    user_id: number;
    access_token: string;
    is_logout: number;
    access_token_expiration_datetime: Date;
    logout_datetime: Date;
    created_datetime: Date;
    updated_datetime: Date;

}

interface UserLoginLogsCreationAttributes extends Optional<UserLoginLogsAttributes, "user_login_log_id" | "is_logout" | "created_datetime" | "updated_datetime" | "logout_datetime"> {}

class UserLoginLogs extends Model<UserLoginLogsAttributes, UserLoginLogsCreationAttributes> implements UserLoginLogsAttributes {
    public user_login_log_id!: number;
    public user_id!: number;
    public access_token!: string;
    public is_logout!: number;
    public access_token_expiration_datetime!: Date;
    public logout_datetime!: Date;
    public created_datetime!: Date;
    public updated_datetime!: Date;

    static associate(models: any) {
        UserLoginLogs.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    }
}

UserLoginLogs.init(
    {
        user_login_log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        access_token: {
            type: DataTypes.STRING(255),
            unique: {
                name: 'unique_token',
                msg: 'Token must be unique',
              },
            allowNull: false,
        },
        is_logout: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        access_token_expiration_datetime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        logout_datetime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_datetime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_datetime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "user_login_logs",
        timestamps: false,
        underscored: true,
    }
);


export { UserLoginLogs };


