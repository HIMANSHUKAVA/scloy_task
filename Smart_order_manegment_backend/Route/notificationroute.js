
import express from "express";

import {
  CreateNotificationController,
  AllNotificationController,
  MarkReadNotificationController,
  MarkAllReadController,
  DeleteNotificationController,
} from "../Controller/notificationcontroller.js"

import {HasRoleMiddlware , VarifyTokenMiddlware} from "../MiddleWare/loginMiddlware.js"
const router = express.Router();

// Create Notification
router.post("/create", VarifyTokenMiddlware , HasRoleMiddlware("Admin"), CreateNotificationController);

// Get All Notifications
router.get("/all", VarifyTokenMiddlware , HasRoleMiddlware("Admin"), AllNotificationController);

// Mark Single Notification as Read
router.put("/read/:id",VarifyTokenMiddlware , HasRoleMiddlware("Admin"), MarkReadNotificationController);

// Mark All Notifications as Read
router.put("/read-all",VarifyTokenMiddlware , HasRoleMiddlware("Admin"), MarkAllReadController);

// Delete Notification
router.delete("/delete/:id",VarifyTokenMiddlware , HasRoleMiddlware("Admin"), DeleteNotificationController);

export default router;
