import express from "express";
import cors from "cors";

import { GetMongoConnection } from "./config/Dbconnection.js";
import router from "./Route/OrderRoute.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

await GetMongoConnection();

app.use("/api", router);

app.listen(5600, () => {
    console.log("Server running on port 5600");
});