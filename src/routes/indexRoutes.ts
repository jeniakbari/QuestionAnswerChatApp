import { Router } from "express";
import { AuthRoute } from "./authRoute"; 
import { UserRoute } from "./userRoute";
import { QuestionRoute } from "./questionRoute";
import { AnswerRoute } from "./answerRoute";
import { CommentRoute } from "./commentRoute";
import { authenticateToken } from "../middleware/authtokenMiddleware";
import { LikeRoute } from "./likeRoute";
import { CoinRoute } from "./coinRoute";
const router = Router();

// Initialize routes
const authRoutes = new AuthRoute();
router.use("/auth", authRoutes.router);

const userRoutes = new UserRoute();
router.use("/user",userRoutes.router);

const quesRoutes = new QuestionRoute();
router.use("/question",authenticateToken,quesRoutes.router);

const ansRoutes = new AnswerRoute();
router.use("/answer",authenticateToken,ansRoutes.router);

const comRoutes = new CommentRoute();
router.use("/comment",authenticateToken,comRoutes.router);

const likeRoutes = new LikeRoute();
router.use("/like",authenticateToken,likeRoutes.router);

const coinRoutes = new CoinRoute();
router.use("/coin",authenticateToken,coinRoutes.router);

export default router;