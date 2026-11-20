import e from "express";
import { deletebyid, findbyid, getdeta, loginuser, ragisteruser, togglebutton, updatebyid } from "../Controller/LoginController.js";
import {VarifyTokenMiddlware , HasRoleMiddlware} from "../MiddleWare/loginMiddlware.js"

const login_router = e.Router();


login_router.post("/ragister" , ragisteruser)
login_router.post("/login-check" , loginuser)
login_router.get("/admin/getdeta" ,VarifyTokenMiddlware , HasRoleMiddlware("Admin"),  getdeta)
login_router.get("/admin/finduserbyid/:id" , VarifyTokenMiddlware ,  HasRoleMiddlware("Admin") , findbyid)
login_router.put("/admin/updatebyuser/:id" , VarifyTokenMiddlware ,  HasRoleMiddlware("Admin") , updatebyid)
login_router.delete("/admin/deletebyid/:id" , VarifyTokenMiddlware ,  HasRoleMiddlware("Admin") , deletebyid)
login_router.put("/admin/toggleroute/:id" , VarifyTokenMiddlware ,  HasRoleMiddlware("Admin") , togglebutton)
export default login_router;