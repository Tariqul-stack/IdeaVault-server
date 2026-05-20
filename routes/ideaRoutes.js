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
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getMyComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getAllIdeas);
router.get("/my-ideas", verifyToken, getMyIdeas);
router.get("/user/my-comments", verifyToken, getMyComments);
router.get("/:id", getIdeaById);
router.post("/", verifyToken, createIdea);
router.patch("/:id", verifyToken, updateIdea);
router.delete("/:id", verifyToken, deleteIdea);
router.get("/:id/comments", getComments);
router.post("/:id/comments", verifyToken, createComment);
router.patch("/:id/comments/:commentId", verifyToken, updateComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);

export default router;
