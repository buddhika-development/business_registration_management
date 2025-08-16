import express from "express";
import * as controller from "../handlers/controllers/businessController.js";

const router = express.Router();

router.get("/:id/documents-with-providers", controller.getDocumentsWithProviders);
router.get("/:id/proprietor", controller.getProprietor);
router.get("/:id/locations", controller.getLocations);
router.get("/:id/documents", controller.getDocuments);
router.get("/:id", controller.getBusiness);

export default router;
