import { config } from "dotenv";

config({ path: ".env" });

export const CREDENTIALS = process.env.CREDENTIALS === "true";

export const { PORT, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
