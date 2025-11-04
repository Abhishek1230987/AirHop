// Test file to verify OpenWeatherMap APIs are working

async function testWeatherAPI() {
  const city = "Delhi";

  console.log(`\n🧪 Testing Weather API for ${city}...`);
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=36cf5f77d9caa7801cf3d28539cad59c&units=metric`
  );

  const weatherData = await weatherResponse.json();
  console.log("✅ Weather Response:", JSON.stringify(weatherData, null, 2));

  if (!weatherData.coord) {
    console.error("❌ No coordinates in weather response!");
    return;
  }

  const { lat, lon } = weatherData.coord;
  console.log(`📍 Got coordinates: ${lat}, ${lon}`);

  console.log(`\n🧪 Testing Pollution API for ${city}...`);
  const pollutionResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=36cf5f77d9caa7801cf3d28539cad59c`
  );

  const pollutionData = await pollutionResponse.json();
  console.log("✅ Pollution Response:", JSON.stringify(pollutionData, null, 2));

  const aqiLevel = pollutionData.list?.[0]?.main?.aqi;
  console.log(`\n✅ AQI Level (0-5 scale): ${aqiLevel}`);
  console.log(`✅ AQI Value (0-500 scale): ${aqiLevel * 100}`);
}

testWeatherAPI().catch((err) => console.error("❌ Error:", err));
