
import Contect_model from "../Model/contect_model.js";

// 1. Add Contact
export async function AddContect(contect) {
  const result = await Contect_model.create(contect);

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
        status: true
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
}
