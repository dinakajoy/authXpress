import { CorsOptions } from "cors";

const allowedOrigins = [
  "http://127.0.0.1:5000",
  "http://localhost:5000",
  "http://localhost:3000",
  "https://authxpress.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"), false);
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
