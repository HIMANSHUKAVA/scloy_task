import not_model from "../Model/notification_model.js";
import { io } from "../app.js";

// Generate Notification
export async function generetnotification(type, message, title) {
  try {
    const notification = await not_model.create({
      title,
      message,
      type,
    });

    // Real-time notification
    if (io) {
      io.emit("newnotification", notification);
    }

    return notification;
  } catch (error) {
    console.log("Notification Error:", error.message);
    throw error;
  }
}

// Get All Notifications
export async function allnotification() {
  try {
    const result = await not_model.find().sort({
      createdAt: -1,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

// Mark Single Notification as Read
export async function Markreadnotificatoin(id) {
  try {
    const result = await not_model.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      { new: true },
    );

    return result;
  } catch (error) {
    throw error;
  }
}

// Mark All Notifications as Read
export async function MarkAllread() {
  try {
    const result = await not_model.updateMany(
      { isRead: false },
      { isRead: true },
    );

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deletenotification(id) {
  try {
    const result = await not_model.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}
