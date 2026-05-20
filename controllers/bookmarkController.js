import { ObjectId } from "mongodb";
import { connectDB } from "../lib/db.js";

// Toggle bookmark (add or remove)
export const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "Invalid idea ID" 
      });
    }

    const db = await connectDB();

    // Check idea exists
    const idea = await db
      .collection("ideas")
      .findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return res.status(404).json({ 
        message: "Idea not found" 
      });
    }

    // Check if already bookmarked
    const existing = await db
      .collection("bookmarks")
      .findOne({ 
        userId: req.user.id, 
        ideaId: id 
      });

    if (existing) {
      // Remove bookmark
      await db
        .collection("bookmarks")
        .deleteOne({ 
          userId: req.user.id, 
          ideaId: id 
        });

      return res.json({ 
        bookmarked: false,
        message: "Bookmark removed" 
      });
    }

    // Add bookmark
    const newBookmark = {
      userId: req.user.id,
      ideaId: id,
      ideaTitle: idea.title,
      ideaCategory: idea.category,
      ideaShortDescription: idea.shortDescription,
      authorName: idea.authorName,
      authorImage: idea.authorImage || null,
      createdAt: new Date(),
    };

    await db
      .collection("bookmarks")
      .insertOne(newBookmark);

    return res.json({ 
      bookmarked: true,
      message: "Bookmarked successfully" 
    });
  } catch (error) {
    next(error);
  }
};

// Check if idea is bookmarked by user
export const checkBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const existing = await db
      .collection("bookmarks")
      .findOne({ 
        userId: req.user.id, 
        ideaId: id 
      });

    res.json({ bookmarked: !!existing });
  } catch (error) {
    next(error);
  }
};

// Get all bookmarks for current user
export const getMyBookmarks = async (req, res, next) => {
  try {
    const db = await connectDB();
    const bookmarks = await db
      .collection("bookmarks")
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};
