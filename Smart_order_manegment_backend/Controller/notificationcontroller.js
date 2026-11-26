
import {
  MarkAllread,
  Markreadnotificatoin,
  allnotification,
  deletenotification,
  generetnotification,
} from "../Model_API/notificationapi.js";

// Generate Notification
export async function CreateNotificationController(req, res) {
  try {
    const { type, message, title } = req.body;

    const result = await generetnotification(type, message, title);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      deta: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get All Notifications
export async function AllNotificationController(req, res) {
  try {
    const result = await allnotification();

    res.status(200).json({
      success: true,
      deta: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Mark Single Notification as Read
export async function MarkReadNotificationController(req, res) {
  try {
    const { id } = req.params;

    const result = await Markreadnotificatoin(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      deta: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Mark All Notifications as Read
export async function MarkAllReadController(req, res) {
  try {
    const result = await MarkAllread();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      deta: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete Notification
export async function DeleteNotificationController(req, res) {
  try {
    const { id } = req.params;

    const result = await deletenotification(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      deta: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
