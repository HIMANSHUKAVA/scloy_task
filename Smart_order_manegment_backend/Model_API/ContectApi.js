import Contect_model from "../Model/contect_model.js";
import { generetnotification } from "../Model_API/notificationapi.js";

async function SendNotification(type, message, title) {
  try {
    await generetnotification(type, message, title);
  } catch (error) {
    console.log("Notification failed:", error.message);
  }
}

// 1. Add Contact
export async function AddContect(contect) {
  const result = await Contect_model.create(contect);

  await SendNotification(
    "contact",
    `New contact message received from ${contect.name}`,
    "New Contact Message",
  );

  return result;
}

// 2. View All Contacts (Admin)
export async function ViewContect() {
  const result = await Contect_model.find().sort({ createdAt: -1 });

  return result;
}

// 3. Admin Reply
export async function updateadminreplay(id, adminreply) {
  const result = await Contect_model.findByIdAndUpdate(
    id,
    {
      $set: {
        adminReply: adminreply,
        resolved: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
}
