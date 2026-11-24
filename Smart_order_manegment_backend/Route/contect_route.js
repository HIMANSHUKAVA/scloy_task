
import {
  AddContectController,
  UpdateAdminReplyController,
  ViewContectController,
} from "../Controller/ContectController.js";

import express from "express";

import {
  HasRoleMiddlware,
  VarifyTokenMiddlware,
} from "../MiddleWare/loginMiddlware.js";

const contect_router = express.Router();

// User: Add Contact
contect_router.post(
  "/user/contect/add",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  AddContectController
);

// Admin: View Contacts
contect_router.get(
  "/admin/contect/view",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  ViewContectController
);

// Admin: Update Reply
contect_router.put(
  "/admin/contect/update/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  UpdateAdminReplyController
);

export default contect_router;
