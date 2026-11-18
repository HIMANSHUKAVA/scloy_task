
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GetMongoConnection } from "./config/Dbconnection.js";
import router from "./Route/OrderRoute.js";
import login_router from "./Route/LoginRoute.js";

dotenv.config();

const app = express();

console.log(
  process.env.JWT_SECRET ? "Secret loaded" : "Secret missing"
);

// CORS Configuration
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((pattern) =>
        pattern.test(origin)
      );

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
await GetMongoConnection();

// Routes
app.use("/api", router);
app.use("/auth", login_router);

// Server
app.listen(5600, () => {
  console.log("Server running on port 5600");
});
