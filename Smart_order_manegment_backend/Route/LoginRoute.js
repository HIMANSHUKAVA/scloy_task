import e from "express";
import { deletebyid, findbyid, getdeta, loginuser, ragisteruser, togglebutton, updatebyid } from "../Controller/LoginController.js";
import {AdminMiddleware} from "../MiddleWare/loginMiddlware.js"
const login_router = e.Router();


login_router.post("/ragister" , ragisteruser)
login_router.post("/login-check" , loginuser)
login_router.get("/admin/getdeta" ,AdminMiddleware , getdeta)
login_router.get("/admin/finduserbyid/:id" , AdminMiddleware , findbyid)
login_router.put("/admin/updatebyuser/:id" , AdminMiddleware , updatebyid)
login_router.delete("/admin/deletebyid/:id" , AdminMiddleware , deletebyid)
login_router.put("/admin/toggleroute/:id" , AdminMiddleware , togglebutton)
export default login_router;