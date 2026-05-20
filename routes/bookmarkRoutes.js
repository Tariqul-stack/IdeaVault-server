import express from "express";
import {
  toggleBookmark,
  checkBookmark,
  getMyBookmarks,
} from "../controllers/bookmarkController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post(
  "/:id/bookmark", 
  verifyToken, 
  toggleBookmark
);
router.get(
  "/:id/bookmark/check", 
  verifyToken, 
  checkBookmark
);
router.get(
  "/my-bookmarks", 
  verifyToken, 
  getMyBookmarks
);

export default router;
