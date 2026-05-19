import express from "express";
import {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  getMyIdeas,
} from "../controllers/ideaController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllIdeas);
router.get("/my-ideas", verifyToken, getMyIdeas);
router.get("/:id", getIdeaById);
router.post("/", verifyToken, createIdea);
router.patch("/:id", verifyToken, updateIdea);
router.delete("/:id", verifyToken, deleteIdea);

export default router;
