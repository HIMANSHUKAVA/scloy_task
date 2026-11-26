
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { GetMongoConnection } from "./config/Dbconnection.js";
import notification_routes from "./Route/notificationroute.js"
import login_router from "./Route/LoginRoute.js";
import product_router from "./Route/Productroute.js";
import order_router from "./Route/OrderRoutes.js";
import wish_route from "./Route/WishliistRoute.js";
import cart_route from "./Route/CartRoute.js";
import contect_router from "./Route/contect_route.js"
import pdf_reouter from "./Route/InvoiceRoute.js";
dotenv.config();

const app = express();

// HTTP Server
const http_server = http.createServer(app);

// Socket.IO
const io = new Server(http_server, {
  cors: {
    origin: [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

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

// Static Images
app.use("/uploads", express.static("uploads"));

// Database Connection
await GetMongoConnection();

// Routes
app.use("/auth", login_router);
app.use("/view", product_router);
app.use("/order", order_router);
app.use("/wish", wish_route);
app.use("/cart", cart_route);
app.use("/contect" , contect_router);
app.use("/pdf" , pdf_reouter)
app.use("/notification", notification_routes);
// Start Server
http_server.listen(5600, () => {
  console.log("Server running on port 5600");
});
