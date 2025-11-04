import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveSearch,
  getSearchHistory,
  getSearchById,
  deleteSearch,
  deleteAllSearches,
} from "../controllers/searchController.js";

const router = express.Router();

// All search routes require authentication
router.use(authMiddleware);

// POST: Save a new search
router.post("/", saveSearch);

// DELETE: Delete all searches for the current user (must be before /:id routes)
router.delete("/", deleteAllSearches);

// GET: Retrieve a specific search by ID
router.get("/:id", getSearchById);

// GET: Retrieve search history for the current user
router.get("/", getSearchHistory);

// DELETE: Delete a specific search by ID
router.delete("/:id", deleteSearch);

export default router;
