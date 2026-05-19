import { ObjectId } from "mongodb";
import { connectDB } from "../lib/db.js";

export const getAllIdeas = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category, search } = req.query;
    const db = await connectDB();
    const ideasCollection = db.collection("ideas");

    const query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const ideas = await ideasCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const totalCount = await ideasCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      ideas,
      totalCount,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

export const getIdeaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const db = await connectDB();
    const idea = await db.collection("ideas").findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(idea);
  } catch (error) {
    next(error);
  }
};

export const createIdea = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      detailedDescription,
      problemStatement,
      proposedSolution,
      targetAudience,
      estimatedBudget,
      coverImageUrl,
      tags,
    } = req.body;

    if (
      !title ||
      !category ||
      !shortDescription ||
      !detailedDescription ||
      !problemStatement ||
      !proposedSolution ||
      !targetAudience
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedTags = [];
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const db = await connectDB();
    const newIdea = {
      title,
      category,
      shortDescription,
      detailedDescription,
      problemStatement,
      proposedSolution,
      targetAudience,
      estimatedBudget,
      coverImageUrl,
      tags: parsedTags,
      authorId: req.user.id,
      authorName: req.user.name,
      authorImage: req.user.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("ideas").insertOne(newIdea);
    newIdea._id = result.insertedId;

    res.status(201).json(newIdea);
  } catch (error) {
    next(error);
  }
};

export const updateIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const db = await connectDB();
    const idea = await db.collection("ideas").findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.authorId;
    delete updateData.authorName;
    delete updateData.authorImage;
    delete updateData.createdAt;

    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
    }

    updateData.updatedAt = new Date();

    const result = await db.collection("ideas").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const db = await connectDB();
    const idea = await db.collection("ideas").findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.collection("ideas").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Idea deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyIdeas = async (req, res, next) => {
  try {
    const db = await connectDB();
    const ideas = await db
      .collection("ideas")
      .find({ authorId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(ideas);
  } catch (error) {
    next(error);
  }
};
