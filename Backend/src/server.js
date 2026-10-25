const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

// Prefer the backend-local configuration described in Backend/README.md, while
// keeping the project-root .env usable for existing local checkouts.
const backendEnv = path.resolve(__dirname, "../.env");
const rootEnv = path.resolve(__dirname, "../../.env");
const envPath = fs.existsSync(backendEnv) ? backendEnv : rootEnv;
dotenv.config({ path: envPath });

const app = require("./app");
const connectDatabase = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error(`JWT_SECRET is missing. Add it to ${envPath}.`);
  }

  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`CV Insights API is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start the API:", error);
  process.exitCode = 1;
});
