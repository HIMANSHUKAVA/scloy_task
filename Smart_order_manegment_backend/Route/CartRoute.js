import express from "express"
import {
  VarifyTokenMiddlware,
  HasRoleMiddlware,
} from "../MiddleWare/loginMiddlware.js";
import { Add_Cart , removecart , viewlist } from "../Controller/Cartcontroller.js";

const cart_route = express.Router();


cart_route.post("/user/:id" , VarifyTokenMiddlware , HasRoleMiddlware("User") , Add_Cart)
cart_route.get("/user/cartlist" , VarifyTokenMiddlware , HasRoleMiddlware("User") , viewlist)
cart_route.delete("/user/removecart/:id" , VarifyTokenMiddlware , HasRoleMiddlware("User") , removecart)



export default cart_route