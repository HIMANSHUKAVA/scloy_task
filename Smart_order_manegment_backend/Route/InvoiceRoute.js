import e from "express";
import { pdfcontroller } from "../Controller/InvoiceController.js";
import {
  HasRoleMiddlware,
  VarifyTokenMiddlware,
} from "../MiddleWare/loginMiddlware.js";

const pdf_router = e.Router();

// User
pdf_router.get(
  "/user/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  pdfcontroller,
);

// Admin
pdf_router.get(
  "/admin/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  pdfcontroller,
);
export default pdf_router;
