import { Router } from "express";
import cookieParser from "cookie-parser";
import { userLogin, refresh, logout } from "../handlers/controllers/authController.js";
import authRegisterController from "../handlers/controllers/authRegisterController.js";

const authRouter = Router();
authRouter.use(cookieParser());


authRouter.post('/login', userLogin);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.post('/register', authRegisterController);

export default authRouter;