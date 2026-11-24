import {
  AddContect,
  ViewContect,
  updateadminreplay,
} from "../Model_API/ContectApi.js";

// 1. Add Contact (User)
export async function AddContectController(req, res) {
  try {
    console.log("Received Data:", req.body);

    const { userid, email, subject, message } = req.body.payload;

    const missingFields = [];

    if (!userid) missingFields.push("userid");
    if (!email) missingFields.push("email");
    if (!subject) missingFields.push("subject");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        missingFields,
      });
    }

    const result = await AddContect({
      userid,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// 2. View All Contacts (Admin)
export async function ViewContectController(req, res) {
  try {
    const result = await ViewContect();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// 3. Admin Reply
export async function UpdateAdminReplyController(req, res) {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    if (!adminReply || !adminReply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Admin reply is required",
      });
    }

    const result = await updateadminreplay(id, adminReply);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin reply submitted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
