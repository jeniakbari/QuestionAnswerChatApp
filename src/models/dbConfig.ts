import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { User } from "./usersModel";
import { Question } from "./questionsModel";
import { Answer } from "./answersModel";
import { Comment } from "./commentsModel";
import { Like } from "./likesModel";
import { CoinsTransaction } from "./coinsTransactionModel";
import { UserLoginLogs } from "./userLoginLogsModel";
dotenv.config();


const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: "",
  host: "localhost", 
  dialect: "mysql", 
  logging: false,
});


export default sequelize;
