// Test all endpoints
const BASE_URL = "http://localhost:5000";

// Helper function for API calls
async function apiCall(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: "ERROR", error: error.message };
  }
}

// Test suite
async function runTests() {
  console.log("🧪 TESTING ALL ENDPOINTS\n");

  let testUser = null;
  let searchId = null;

  // Test 1: Signup
  console.log("📝 Test 1: AUTH SIGNUP");
  const signupRes = await apiCall("POST", "/api/auth/signup", {
    email: `test${Date.now()}@airhop.com`,
    password: "Test@123",
  });
  console.log(`Status: ${signupRes.status}`);
  console.log(`Response: ${JSON.stringify(signupRes.data)}\n`);

  if (signupRes.status === 201 || signupRes.status === 200) {
    testUser = signupRes.data.user;
  }

  // Test 2: Login
  console.log("🔐 Test 2: AUTH LOGIN");
  const loginRes = await apiCall("POST", "/api/auth/login", {
    email: signupRes.data?.user?.email || "test@airhop.com",
    password: "Test@123",
  });
  console.log(`Status: ${loginRes.status}`);
  console.log(`Response: ${JSON.stringify(loginRes.data)}\n`);

  // Test 3: Search - Save Search History
  console.log("🔍 Test 3: SAVE SEARCH HISTORY");
  const searchRes = await apiCall("POST", "/api/search", {
    from: "Delhi",
    to: "Mumbai",
    route: "Delhi -> Mumbai",
    aqi: 85,
  });
  console.log(`Status: ${searchRes.status}`);
  console.log(`Response: ${JSON.stringify(searchRes.data)}\n`);

  if (searchRes.data?.search?._id) {
    searchId = searchRes.data.search._id;
  }

  // Test 4: Get Search History
  console.log("📋 Test 4: GET SEARCH HISTORY");
  const getSearchRes = await apiCall("GET", "/api/search");
  console.log(`Status: ${getSearchRes.status}`);
  console.log(`Response: ${JSON.stringify(getSearchRes.data)}\n`);

  // Test 5: Delete Search
  if (searchId) {
    console.log(`🗑️  Test 5: DELETE SEARCH (ID: ${searchId})`);
    const deleteRes = await apiCall("DELETE", `/api/search/${searchId}`);
    console.log(`Status: ${deleteRes.status}`);
    console.log(`Response: ${JSON.stringify(deleteRes.data)}\n`);
  }

  // Test 6: AQI Data
  console.log("🌍 Test 6: GET AQI DATA");
  const aqiRes = await apiCall("GET", "/api/aqi?city=Delhi");
  console.log(`Status: ${aqiRes.status}`);
  console.log(`Response: ${JSON.stringify(aqiRes.data)}\n`);

  console.log("✅ ENDPOINT TESTS COMPLETE");
}

// Run tests
runTests().catch(console.error);
