import express from "express";


import {
  VarifyTokenMiddlware,
  HasRoleMiddlware,
} from "../Middleware/loginMiddlware.js";

import { aproverd_request, cancelrequest, create_order_user, fetchorders, findsingleorder, Getallorderadmin, orderstatus, reject } from "../Controller/OrderControllers.js";

const order_router = express.Router();

// ================= USER ROUTES =================

// Create Order
order_router.post(
  "/user/ordercreate",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  create_order_user,
);

// View My Orders
order_router.get(
  "/user/orderview",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  fetchorders,
);

// View Single Order
order_router.get(
  "/user/single-order/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  findsingleorder,
);

// Send Cancellation Request
order_router.post(
  "/user/cancelrequest/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("User"),
  cancelrequest,
);

// ================= ADMIN ROUTES =================

// Fetch All Orders
order_router.get(
  "/admin/fetchorderbyadmin",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  Getallorderadmin,
);

// Update Order Status
order_router.put(
  "/admin/orderstatus/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  orderstatus,
);

// Approve Cancellation Request
order_router.put(
  "/admin/approvedrequest/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  aproverd_request,
);

// Reject Cancellation Request
order_router.put(
  "/admin/rejectrequest/:id",
  VarifyTokenMiddlware,
  HasRoleMiddlware("Admin"),
  reject
);

export default order_router;

