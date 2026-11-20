import express from "express";

import {
  deleteproduct,
  FindByuserid,
  saveproduct,
  updateproduct,
  viewproducts,
} from "../Controller/productcontroller.js";

import sp from "../config/upload.js";
import {
  VarifyTokenMiddlware,
  HasRoleMiddlware,
} from "../MiddleWare/loginMiddlware.js";

const product_router = express.Router();

// NORMAL USER: View Products
product_router.get(
  "/product/user/getdeta",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  viewproducts,
);

// ADMIN: Add Product
product_router.post(
  "/addproduct",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),

  sp.single("productImage"),
  saveproduct,
);

// ADMIN: Update Product
product_router.put(
  "/updateproductbyid/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),

  sp.single("productImage"),
  updateproduct,
);

// ADMIN: Delete Product
product_router.delete(
  "/delete-product/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  deleteproduct,
);

// ADMIN: View All Products
product_router.get(
  "/product/admin/viewdeta",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  viewproducts,
);

// ADMIN: View Single Product
product_router.get(
  "/product/admin/single-product/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  FindByuserid,
);

export default product_router;
