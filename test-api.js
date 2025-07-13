const fetch = require("node-fetch");

async function testAPI() {
  try {
    // Test login
    console.log("Testing login...");
    const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const loginData = await loginResponse.json();
    console.log("Login successful:", !!loginData.token);

    if (loginData.token) {
      // Test protected route
      console.log("Testing dashboard stats...");
      const statsResponse = await fetch(
        "http://localhost:8080/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
          },
        },
      );

      const statsData = await statsResponse.json();
      console.log("Dashboard stats response:", statsData);

      // Test events
      console.log("Testing events...");
      const eventsResponse = await fetch("http://localhost:8080/api/events", {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      const eventsData = await eventsResponse.json();
      console.log("Events response:", eventsData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAPI();
