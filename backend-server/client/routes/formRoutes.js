import { Router } from "express";
import authenticate from "../services/middleware/authenticate.js";
import authorizeRole from "../services/middleware/authorizeRole.js";
import { step1Controller } from "../handlers/controllers/step1Controller.js";


const formRouter = Router();

formRouter.post("/step1-business", authenticate, authorizeRole('user'), step1Controller)


export default formRouter;