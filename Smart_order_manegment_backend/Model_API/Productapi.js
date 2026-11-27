
import { SendLowStockEmail } from "../Mail/MailAPI.js";
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

// Low stock limit
const LOW_STOCK_LIMIT = 1;

// Admin email helper
async function SendAdminStockAlert(product, type) {
  try {
    await SendLowStockEmail(product);
    console.log(`${type} mail sent to admin`);
  } catch (error) {
    console.log("MAIL error by admin:", error.message);
  }
}

// Add Product
export async function Addproduct(product) {
  const result = await product_model.create(product);

  // Low Stock
  if (result.stock > 0 && result.stock <= LOW_STOCK_LIMIT) {
    await SendNotification(
      "lowstock",
      `${result.productName} has only ${result.stock} items remaining`,
      "Low Stock Alert"
    );

    await SendAdminStockAlert(result, "Low Stock");
  }

  // Out of Stock
  else if (result.stock === 0) {
    await SendNotification(
      "stockout",
      `${result.productName} is out of stock`,
      "Out of Stock Alert"
    );

    await SendAdminStockAlert(result, "Out of Stock");
  }

  return result;
}

// View All Products
export async function viewproduct() {
  const result = await product_model.find();
  return result;
}

// Delete Product
export async function deletebyid(id) {
  const result = await product_model.findByIdAndDelete(id);
  return result;
}

// Get Single Product
export async function getsingledeta(id) {
  const result = await product_model.findById(id);
  return result;
}

// Update Product
export async function updatebyid(id, product) {
  const oldProduct = await product_model.findById(id);

  if (!oldProduct) {
    throw new Error("Product not found");
  }

  const oldStock = oldProduct.stock;

  const result = await product_model.findOneAndUpdate(
    { _id: id },
    product,
    {
      returnDocument: "after",
      runValidators: true
    }
  );

  if (!result) {
    throw new Error("Product not found");
  }

  const newStock = result.stock;

  console.log("OLD STOCK:", oldStock);
  console.log("NEW STOCK:", newStock);

  // Out of Stock
  if (oldStock > 0 && newStock === 0) {
    await SendNotification(
      "stockout",
      `${result.productName} is now out of stock`,
      "Out of Stock Alert"
    );

    await SendAdminStockAlert(result, "Out of Stock");
  }

  // Low Stock
  else if (
    oldStock > LOW_STOCK_LIMIT &&
    newStock > 0 &&
    newStock <= LOW_STOCK_LIMIT
  ) {
    await SendNotification(
      "lowstock",
      `${result.productName} has only ${newStock} items remaining`,
      "Low Stock Alert"
    );

    await SendAdminStockAlert(result, "Low Stock");
  }

  return result;
}

// Find Product By SKU
export async function findBySKU(sku) {
  return await product_model.findOne({ sku });
}
