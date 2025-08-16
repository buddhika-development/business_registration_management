import { Router } from 'express';
import sendMailController from '../handlers/controllers/gov/sendMailController.js';
import getTokenInfoController from '../handlers/controllers/gov/getTokenInfoController.js';
import submitDecisionController from '../handlers/controllers/gov/submitDecisionController.js';
import authenticate from '../services/middleware/authenticate.js';
import authorizeRole from '../services/middleware/authorizeRole.js';


const govRouter = Router();

govRouter.post('/mail-sending', sendMailController);

// used by the external Gov portal
govRouter.get('/verify/:token', getTokenInfoController);
govRouter.post('/verify/:token/decision', submitDecisionController);

export default govRouter;
