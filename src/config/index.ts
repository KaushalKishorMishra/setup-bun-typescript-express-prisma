import { config } from "dotenv";

config({ path: ".env" });

export const CREDENTIALS = process.env.CREDENTIALS === "true";

export const { PORT, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

export const { IMAGE_UPLOAD_PATH, FILE_UPLOAD_PATH, JWT_SECRET_KEY } = process.env;