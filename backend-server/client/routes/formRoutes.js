import { Router } from "express";
import authenticate from "../services/middleware/authenticate.js";
import authorizeRole from "../services/middleware/authorizeRole.js";
import { step1Controller } from "../handlers/controllers/step1Controller.js";
import { step2Controller } from "../handlers/controllers/step2Controller.js";
import { step3Controller } from "../handlers/controllers/step3Controller.js";


const formRouter = Router();

formRouter.post("/step1-business", authenticate, authorizeRole('user'), step1Controller);
formRouter.post("/step2-BusinessDetails", authenticate, authorizeRole('user'), step2Controller);
formRouter.post("/step3-contacts", authenticate, authorizeRole('user'), step3Controller);


export default formRouter;