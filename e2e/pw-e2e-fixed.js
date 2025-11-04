const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const puppeteer = require("puppeteer");

(async () => {
  try {
    const argv = process.argv.slice(2);
    let frontend =
      process.env.FRONTEND_URL ||
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      "http://localhost:3000";
    let headless = true;

    argv.forEach((a) => {
      if (a.startsWith("--url=")) frontend = a.split("=")[1];
      if (a.startsWith("--headless=")) headless = a.split("=")[1] !== "false";
      if (a === "--help" || a === "-h") {
        console.log(
          "Usage: node e2e/pw-e2e-fixed.js [--url=http://localhost:3000] [--headless=true|false]"
        );
        process.exit(0);
      }
    });

    const signupUrl = frontend.replace(/\/$/, "") + "/signup";
    const outDir = path.join(__dirname, "output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    console.log(
      "Launching browser (headless=" + headless + ") and visiting",
      signupUrl
    );
    const browser = await puppeteer.launch({
      headless,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);

    await page.goto(signupUrl, { waitUntil: "networkidle2" });

    const timestamp = Date.now();
    const testEmail = `e2e_ui_${timestamp}@example.com`;
    const testPassword = "E2EPass!234";
    const testName = `E2E User ${timestamp}`;

    // Try to fill common signup fields if present; tolerate missing selectors
    try {
      await page.waitForSelector('input[name="name"]', { timeout: 3000 });
    } catch (e) {}
    await page
      .type('input[name="name"]', testName, { delay: 50 })
      .catch(() => {});
    await page
      .type('input[name="email"]', testEmail, { delay: 50 })
      .catch(() => {});
    await page
      .type('input[name="password"]', testPassword, { delay: 50 })
      .catch(() => {});
    await page
      .type('input[name="confirmPassword"]', testPassword, { delay: 50 })
      .catch(() => {});

    // Submit and wait for navigation/XHR (best-effort)
    await Promise.all([
      page.click('button[type="submit"]').catch(() => {}),
      page
        .waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 })
        .catch(() => null),
    ]);

    // Small pause to allow background requests
    await new Promise((res) => setTimeout(res, 1000));

    const screenshotPath = path.join(outDir, `signup-${timestamp}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const cookies = await page.cookies();
    const tokenCookie = cookies.find((c) => c.name === "token");

    console.log("Screenshot saved to:", screenshotPath);
    console.log("Test email:", testEmail);
    console.log("Token cookie present:", !!tokenCookie);
    if (tokenCookie)
      console.log("Token cookie details:", {
        name: tokenCookie.name,
        httpOnly: tokenCookie.httpOnly,
        secure: tokenCookie.secure,
        expires: tokenCookie.expires,
      });

    await browser.close();

    // Run backend listing script to confirm DB entries (best-effort)
    try {
      console.log("\nListing DB users (backend/scripts/listUsers.js):");
      const out = execSync("node backend/scripts/listUsers.js", {
        encoding: "utf8",
      });
      console.log(out);
    } catch (err) {
      console.error("Error running listUsers.js:", err.message);
    }

    console.log("\nE2E run complete.");
    process.exit(0);
  } catch (err) {
    console.error("E2E error:", err);
    process.exit(1);
  }
})();
