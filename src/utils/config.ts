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
  CORS: process.env.CORS ? (JSON.parse(process.env.CORS) as string[]) : "*",
  PORT: Number(process.env.PORT ?? "4000"),
  REST_API_ENABLED: process.env.REST_API_ENABLED !== "false",
  REST_API_PATH: process.env.REST_API_PATH ?? "/api",
  REST_API_KEY: process.env.REST_API_KEY,
  GRAPHQL_API_ENABLED: process.env.GRAPHQL_API_ENABLED !== "false",
  GRAPHQL_API_INTROSPECTION: process.env.GRAPHQL_API_INTROSPECTION !== "false",
  GRAPHQL_API_PATH: process.env.GRAPHQL_API_PATH ?? "/graphql",
  GRPC_PORT: Number(process.env.GRPC_PORT ?? "4051"),
  GRPC_API_ENABLED: process.env.GRPC_API_ENABLED !== "false",
  GRPC_API_REFLECTION: process.env.GRPC_API_REFLECTION !== "false",
};
