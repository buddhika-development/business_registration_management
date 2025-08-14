import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorizeRole from '../middleware/authorizeRole.js';
import { ok } from '../utils/resp.js';

const router = Router();


router.get('/me', authenticate, authorizeRole('user'), (req, res) => {
    return ok(res, { id: req.user.id, nic: req.user.nic, role: req.user.role }, 'Current user.');
});

export default router;
