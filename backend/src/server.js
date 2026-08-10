import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "PORT"];
const missing = requiredEnvVars.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const PORT = Number(process.env.PORT);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error("PORT must be a valid integer between 1 and 65535");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

