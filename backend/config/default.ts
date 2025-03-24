import dotenv from "dotenv-safe";

dotenv.config();

export default {
  environment: {
    host: String(process.env.HOST || '0.0.0.0'),
    port: Number(String(process.env.PORT)) || 1337,
    clientUrl: String(process.env.CLIENT_URL) || "localhost:3000",
  },
  dbConfig: {
    url: process.env.DATABASE_URL || "",
    saltWorkFactor: Number(String(process.env.SALTWORKFACTOR)) || 10,
  },
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || "ZfqQuxIS+7/J6VfbWT+7/btX",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "SsqQuxISJ6sZf+7/J6VfSWTtX",
  },
  emailConfig: {
    user: process.env.EMAIL_USER || "test@email.com",
    password: process.env.EMAIL_PASS || "ISJSsqQux6s",
  },
};
