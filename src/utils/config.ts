import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export const ENV = {
  //postgress
  DATABASE_URL: process.env.DATABASE_URL!,
  //app
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  IS_DEV: process.env.NODE_ENV === "development",
  PORT: 4000,
};
