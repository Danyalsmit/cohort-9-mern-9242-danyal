import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "PORT"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10) || 5000;

if (isNaN(PORT)) {
  console.error("PORT must be a valid number");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

