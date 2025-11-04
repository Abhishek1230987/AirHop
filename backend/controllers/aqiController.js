import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getAQI = async (req, res) => {
  const city = req.params.city; // get city from URL like /api/aqi/delhi
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OpenWeather API Key in .env");
    return res.status(500).json({ error: "Server missing API key" });
  }

  try {
    // Get latitude & longitude for the city
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = geoResponse.data[0];

    // Fetch air pollution (AQI) data
    const aqiResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    console.log(`✅ AQI fetched for ${city}:`, aqiResponse.data);
    res.json(aqiResponse.data);

  } catch (error) {
    console.error("❌ Error fetching AQI data:", error.message);
    res.status(500).json({ error: "Failed to fetch AQI data" });
  }
};
