import config from "config";
import app from "./app";
import { logger, connectDB } from "./utils";

const HOST = config.get('environment.host') as string;
const PORT = config.get('environment.port') as number;

app.listen(PORT, () => {
  // Connect to MongoDB
  connectDB();
  logger.info(`🚀 Server running at ${HOST}:${PORT}`);
});
