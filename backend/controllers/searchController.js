import SearchHistory from "../models/SearchHistory.js";

// Save a new search to history
export const saveSearch = async (req, res) => {
  try {
    console.log("📥 [saveSearch] Received request");
    console.log("👤 [saveSearch] req.user:", req.user);

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      console.error("❌ [saveSearch] No userId found");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {
      source,
      destination,
      sourceAQI,
      destinationAQI,
      routes,
      selectedRoute,
      selectedRouteDetails,
      notes,
    } = req.body;

    console.log("📦 [saveSearch] Request body:", {
      source,
      destination,
      hasSourceAQI: !!sourceAQI,
      hasDestAQI: !!destinationAQI,
      routesCount: routes?.length,
      selectedRoute,
    });

    if (!source || !destination) {
      console.error("❌ [saveSearch] Missing source or destination");
      return res
        .status(400)
        .json({ error: "Source and destination are required" });
    }

    const search = await SearchHistory.create({
      userId,
      source,
      destination,
      sourceAQI,
      destinationAQI,
      routes: routes || [],
      selectedRoute: selectedRoute || null,
      selectedRouteDetails: selectedRouteDetails || null,
      notes,
    });

    console.log(`✅ [saveSearch] Saved search for user ${userId}:`, {
      source,
      destination,
      selectedRoute,
      searchId: search._id,
    });

    res.json({ search });
  } catch (err) {
    console.error("❌ [saveSearch] error saving search:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get all searches for the current user
export const getSearchHistory = async (req, res) => {
  try {
    console.log("📥 [getSearchHistory] Received request");
    console.log("👤 [getSearchHistory] req.user:", req.user);

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      console.error("❌ [getSearchHistory] No userId found");
      return res.status(401).json({ error: "Not authenticated" });
    }

    console.log(`🔍 [getSearchHistory] Fetching searches for user ${userId}`);

    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const searches = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SearchHistory.countDocuments({ userId });

    console.log(
      `✅ [getSearchHistory] Retrieved ${searches.length} searches for user ${userId}, total: ${total}`
    );

    if (searches.length === 0) {
      console.warn(
        `⚠️ [getSearchHistory] No searches found for user ${userId}`
      );
    } else {
      console.log(
        `📊 [getSearchHistory] First search:`,
        JSON.stringify(searches[0], null, 2).substring(0, 500)
      );
    }

    res.json({ searches, total, limit, skip });
  } catch (err) {
    console.error(
      "❌ [getSearchHistory] error fetching search history:",
      err.message
    );
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Delete a single search by ID
export const deleteSearch = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const searchId = req.params.id;
    const search = await SearchHistory.findById(searchId);

    if (!search) {
      return res.status(404).json({ error: "Search not found" });
    }

    // Verify ownership
    if (search.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this search" });
    }

    await SearchHistory.findByIdAndDelete(searchId);
    console.log(`[search] deleted search ${searchId} for user ${userId}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[search] error deleting search:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete all searches for the current user (bulk delete)
export const deleteAllSearches = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const result = await SearchHistory.deleteMany({ userId });
    console.log(
      `[search] deleted ${result.deletedCount} searches for user ${userId}`
    );
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("[search] error deleting all searches:", err);
    res.status(500).json({ error: "Server error" });
  }
};
