import { ObjectId } from "mongodb";
import { connectDB } from "../lib/db.js";

// GET all comments for an idea
export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "Invalid idea ID" 
      });
    }

    const db = await connectDB();
    const comments = await db
      .collection("comments")
      .find({ ideaId: id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// POST create a comment
export const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "Invalid idea ID" 
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        message: "Comment text is required" 
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

    const newComment = {
      ideaId: id,
      ideaTitle: idea.title,
      userId: req.user.id,
      userName: req.user.name,
      userImage: req.user.image || null,
      text: text.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("comments")
      .insertOne(newComment);

    newComment._id = result.insertedId;
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// PATCH update a comment
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ 
        message: "Invalid comment ID" 
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        message: "Comment text is required" 
      });
    }

    const db = await connectDB();
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ 
        message: "Comment not found" 
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ 
        message: "Not authorized" 
      });
    }

    const result = await db
      .collection("comments")
      .findOneAndUpdate(
        { _id: new ObjectId(commentId) },
        { 
          $set: { 
            text: text.trim(), 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: "after" }
      );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ 
        message: "Invalid comment ID" 
      });
    }

    const db = await connectDB();
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ 
        message: "Comment not found" 
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ 
        message: "Not authorized" 
      });
    }

    await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(commentId) });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET all comments by current user
// (for my-interactions page)
export const getMyComments = async (req, res, next) => {
  try {
    const db = await connectDB();
    const comments = await db
      .collection("comments")
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(comments);
  } catch (error) {
    next(error);
  }
};
