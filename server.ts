import express from "express";
import sequelize from "./src/models/dbConfig";
import dotenv from 'dotenv'
import {User} from './src/models/usersModel';
import { Question } from "./src/models/questionsModel";
import { Answer } from "./src/models/answersModel";
import { Comment } from "./src/models/commentsModel";
import { Like } from "./src/models/likesModel";
import { UserLoginLogs } from "./src/models/userLoginLogsModel";
import { CoinsTransaction } from "./src/models/coinsTransactionModel";
import {ExpertQuestionMap} from "./src/models/expertQuestionMapModel";
import {Chat} from './src/models/chatModel';
import { AuthRoute } from "./src/routes/authRoute";
import { Router } from "express";
import router from './src/routes/indexRoutes';


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// new AuthRoute(router);
app.use("/api", router);


async function startServer(){
  try {
      await sequelize.authenticate();
      console.log("Database Connected Successfully");
      User.associate({Question,Answer,Comment,Like,UserLoginLogs,CoinsTransaction,ExpertQuestionMap,Chat });
      UserLoginLogs.associate({User});
      Question.associate({User,Answer,ExpertQuestionMap,Chat});
      Like.associate({User,Answer});
      Comment.associate({User,Answer});
      CoinsTransaction.associate({User});
      Answer.associate({User,Question,Comment});
      ExpertQuestionMap.associate({User,Question});
      Chat.associate({User,Question})
      await sequelize.sync({alter:true});
      app.listen(process.env.PORT,()=>{
        console.log(`Server Running on PORT ${process.env.PORT}`);
        
      })
  }
  catch (error) {
      console.log("Error connecting to database",error)
  }
}

startServer();

// const newUser = User.create({
//   first_name: 'Johnny',
//   last_name: 'John',
//   password: 'securepassword12', // Set a proper password
//   email: 'johnny12@example.com', // Provide a unique email
// }).then(()=>{
//   console.log("Data Entered Successfully")
// }).catch((err)=>{
//   console.log("Error occurred",err)
// });