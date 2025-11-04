import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    // Store weather/AQI data at the time of search
    sourceAQI: {
      aqi: Number,
      pm25: Number,
      pm10: Number,
      temperature: Number,
      humidity: Number,
      location: String,
    },
    destinationAQI: {
      aqi: Number,
      pm25: Number,
      pm10: Number,
      temperature: Number,
      humidity: Number,
      location: String,
    },
    // Store route details for all 3 routes
    routes: [
      {
        type: {
          type: String,
          enum: ["fastest", "balanced", "healthiest"],
        },
        distance: Number, // in km
        duration: Number, // in minutes
        avgAQI: Number,
        pollution: {
          type: String,
          enum: ["low", "moderate", "high"],
        },
        description: String,
      },
    ],
    // Store selected route
    selectedRoute: {
      type: String,
      enum: ["fastest", "balanced", "healthiest"],
    },
    selectedRouteDetails: {
      distance: Number,
      duration: Number,
      avgAQI: Number,
      pollution: String,
    },
    notes: String, // user notes about the route
  },
  { timestamps: true }
);

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
export default SearchHistory;
