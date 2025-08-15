import express from "express";
import { checkBusinessName } from "../handlers/controllers/nameCheckerController.js";

const router = express.Router();

router.post("/name-check", checkBusinessName);

export default router;
