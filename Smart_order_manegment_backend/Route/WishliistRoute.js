import { remove_wishlist_controller , addwishlist, Wishlistt, single_wishlist } from "../Controller/wishlistcontroller.js";
import mongoose from "mongoose";
import express from "express"
import {
  VarifyTokenMiddlware,
  HasRoleMiddlware,
} from "../MiddleWare/loginMiddlware.js";

const wish_route = express.Router()

wish_route.post("/user/add-wish/:id" , VarifyTokenMiddlware , HasRoleMiddlware("User") , addwishlist )
wish_route.delete("/user/delete-wish/:id" , VarifyTokenMiddlware , HasRoleMiddlware("User") , remove_wishlist_controller)
wish_route.get("/user/viewlist" , VarifyTokenMiddlware , HasRoleMiddlware("User") , Wishlistt)
wish_route.get("/user/wishsingle/:id" , VarifyTokenMiddlware , HasRoleMiddlware("User"), single_wishlist)
export default wish_route

