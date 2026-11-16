import e from "express";
import { loginuser, ragisteruser } from "../Controller/LoginController.js";

const login_router = e.Router();


login_router.post("/ragister" , ragisteruser)
login_router.post("/login-check" , loginuser)

export default login_router;