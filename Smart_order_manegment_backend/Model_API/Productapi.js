import product_model from "../Model/ProductModel.js";
import { generetnotification } from "./notificationapi.js";

// Notification helper
async function SendNotification(type, message, title) {
  try {
    await generetnotification(type, message, title);
  } catch (error) {
    console.log("Notification failed:", error.message);
  }
}

const LOW_STOCK_LIMIT = 1;

export async function Addproduct(product) {
  const result = await product_model.create(product);

  // New product has low stock
  if (result.stock <= LOW_STOCK_LIMIT && result.stock > 0) {
    await SendNotification(
      "lowstock",
      `${result.productName} has only ${result.stock} items remaining`,
      "Low Stock Alert",
    );
  }

  // New product has zero stock
  if (result.stock === 0) {
    await SendNotification(
      "stockout",
      `${result.productName} is out of stock`,
      "Out of Stock Alert",
    );
  }

  return result;
}

export async function viewproduct() {
  const result = await product_model.find();
  return result;
}

export async function deletebyid(id) {
  const result = await product_model.findByIdAndDelete(id);
  return result;
}

export async function getsingledeta(id) {
  const result = await product_model.findById(id);
  return result;
}

// export async function updatebyid(id, product) {
//   // Get old product stock
//   const oldProduct = await product_model.findById(id);

//   if (!oldProduct) {
//     throw new Error("Product not found");
//   }

//   const result = await product_model.findOneAndUpdate({ _id: id }, product, {
//     new: true,
//   });

//   if (!result) {
//     throw new Error("Product not found");
//   }

//   const oldStock = oldProduct.stock;
//   const newStock = result.stock;

//   // Stock becomes zero
//   if (oldStock > 0 && newStock === 0) {
//     await SendNotification(
//       "stockout",
//       `${result.productName} is now out of stock`,
//       "Out of Stock Alert",
//     );
//   }

//   // Stock crosses the low-stock threshold
//   else if (
//     oldStock > LOW_STOCK_LIMIT &&
//     newStock > 0 &&
//     newStock <= LOW_STOCK_LIMIT
//   ) {
//     await SendNotification(
//       "lowstock",
//       `${result.productName} has only ${newStock} items remaining`,
//       "Low Stock Alert",
//     );
//   }

//   return result;
// }


export async function updatebyid(id, product) {
  const oldProduct = await product_model.findById(id);

  if (!oldProduct) {
    throw new Error("Product not found");
  }

  const result = await product_model.findOneAndUpdate(
    { _id: id },
    product,
    { new: true }
  );

  const oldStock = oldProduct.stock;
  const newStock = result.stock;

  console.log("OLD STOCK:", oldStock);
  console.log("NEW STOCK:", newStock);
  console.log("CONDITION:", oldStock > 0 && newStock === 0);

  if (oldStock > 0 && newStock === 0) {
    console.log("OUT OF STOCK CONDITION MATCHED");

    await SendNotification(
      "stockout",
      `${result.productName} is now out of stock`,
      "Out of Stock Alert"
    );

    console.log("SEND NOTIFICATION COMPLETED");
  }

  return result;
}
export async function findBySKU(sku) {
  return await product_model.findOne({ sku });
}
