import dotenv from "dotenv-safe";

dotenv.config();

export default {
  environment: {
    host: String(process.env.HOST || "0.0.0.0"),
    port: Number(String(process.env.PORT)) || 1337,
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    secret: process.env.SECRET || "http://localhost:3000",
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
  googleConfig: {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
  },
};
