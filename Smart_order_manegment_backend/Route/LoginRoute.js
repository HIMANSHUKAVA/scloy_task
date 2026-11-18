import e from "express";
import { getdeta, loginuser, ragisteruser } from "../Controller/LoginController.js";
import {AdminMiddleware} from "../MiddleWare/loginMiddlware.js"
const login_router = e.Router();


login_router.post("/ragister" , ragisteruser)
login_router.post("/login-check" , loginuser)
login_router.get("/admin/getdeta" ,AdminMiddleware , getdeta)


export default login_router;