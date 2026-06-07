import { defineConfig } from "prisma/config";
import { configDotenv } from "dotenv";

configDotenv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
