import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GetMongoConnection } from "./config/Dbconnection.js";
import router from "./Route/OrderRoute.js";
import login_router from "./Route/LoginRoute.js";

const app = express();

dotenv.config();

console.log(
    process.env.JWT_SECRET ? "Secret loaded" : "Secret missing"
);
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(express.urlencoded());
await GetMongoConnection();

app.use("/api", router);
app.use("/auth" , login_router)
app.listen(5600, () => {
    console.log("Server running on port 5600");
});