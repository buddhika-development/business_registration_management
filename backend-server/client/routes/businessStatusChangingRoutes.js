import { Router } from "express";
import { businessStatusChangeController } from "../handlers/controllers/businessStatusChangeController.js";


const statusChange = Router();

statusChange.post("/status-change", businessStatusChangeController);

export default statusChange;