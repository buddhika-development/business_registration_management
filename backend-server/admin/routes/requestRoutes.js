import express from "express";
import * as controller from "../handlers/controllers/requestController.js";

const router = express.Router();

router.get("/", controller.getRequests);
router.get("/:id", controller.getRequest);
router.put("/:id", controller.updateRequest);


export default router;
