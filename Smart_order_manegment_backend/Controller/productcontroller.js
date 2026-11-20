
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

import {
  Addproduct,
  deletebyid,
  getsingledeta,
  updatebyid,
  viewproduct,
  findBySKU
} from "../Model_API/Productapi.js";


// Helper: Delete image safely
async function deleteImage(imagePath) {
  if (!imagePath) return;

  const filename = path.basename(imagePath);
  console.log("file name" + filename);
  
  const fullPath = path.join(
    process.cwd(),
    "uploads",
    "products",
    filename
  );

  console.log("working directory" , process.cwd());
  
  console.log("full path" , fullPath);
  
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Image deletion failed:", error.message);
    }
  }
}


// Helper: Validate MongoDB ID
function validId(id) {
  return mongoose.isValidObjectId(id);
}


// 1. ADD PRODUCT
export async function saveproduct(req, resp) {
  try {
    const {
      productName,
      sku,
      price,
      description,
      stock
    } = req.body;

    if (!productName || !sku || price === undefined ||
        !description || stock === undefined) {
      if (req.file) {
        await deleteImage(req.file.filename);
      }

      return resp.status(400).json({
        message: "All product fields are required"
      });
    }

    if (!req.file) {
      return resp.status(400).json({
        message: "Product image is required"
      });
    }

    const existing_product = await findBySKU(sku);

    if (existing_product) {
      await deleteImage(req.file.filename);

      return resp.status(409).json({
        message: "This SKU already exists"
      });
    }

    const imagePath =
      `/uploads/products/${req.file.filename}`;

    const result = await Addproduct({
      productName,
      sku,
      price: Number(price),
      description,
      stock: Number(stock),
      productImage: imagePath
    });

    return resp.status(201).json({
      message: "Product added successfully",
      data: result
    });

  } catch (error) {
    if (req.file) {
      await deleteImage(req.file.filename);
    }

    if (error.code === 11000) {
      return resp.status(409).json({
        message: "SKU already exists"
      });
    }

    return resp.status(500).json({
      message: error.message
    });
  }
}


// 2. VIEW ALL PRODUCTS
export async function viewproducts(req, resp) {
  try {
    const result = await viewproduct();

    return resp.status(200).json({
      message: "Products fetched successfully",
      data: result
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message
    });
  }
}


// 3. GET SINGLE PRODUCT
export async function FindByuserid(req, resp) {
  try {
    const id = req.params.id;

    if (!validId(id)) {
      return resp.status(400).json({
        message: "Invalid product ID"
      });
    }

    const result = await getsingledeta(id);

    if (!result) {
      return resp.status(404).json({
        message: "Product not found"
      });
    }

    return resp.status(200).json({
      message: "Product found",
      data: result
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message
    });
  }
}


// 4. DELETE PRODUCT
export async function deleteproduct(req, resp) {
  try {
    const id = req.params.id;

    if (!validId(id)) {
      return resp.status(400).json({
        message: "Invalid product ID"
      });
    }

    const result = await deletebyid(id);

    if (!result) {
      return resp.status(404).json({
        message: "Product not found"
      });
    }

    // Delete associated image after DB deletion
    await deleteImage(result.productImage);

    return resp.status(200).json({
      message: "Product deleted successfully",
      data: result
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message
    });
  }
}


// 5. UPDATE PRODUCT
export async function updateproduct(req, resp) {
  let newImage = null;

  try {
    const id = req.params.id;

    if (!validId(id)) {
      if (req.file) await deleteImage(req.file.filename);

      return resp.status(400).json({
        message: "Invalid product ID"
      });
    }

    // Find old product
    const oldProduct = await getsingledeta(id);

    if (!oldProduct) {
      if (req.file) await deleteImage(req.file.filename);

      return resp.status(404).json({
        message: "Product not found"
      });
    }

    newImage = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const updateData = { ...req.body };

    // Convert numeric fields
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    // Check duplicate SKU
    if (
      updateData.sku &&
      updateData.sku !== oldProduct.sku
    ) {
      const existingProduct = await findBySKU(updateData.sku);

      if (existingProduct) {
        if (req.file) await deleteImage(req.file.filename);

        return resp.status(409).json({
          message: "This SKU already exists"
        });
      }
    }

    // Add new image path only if image uploaded
    if (newImage) {
      updateData.productImage = newImage;
    }

    // Update MongoDB
    const result = await updatebyid(id, updateData);

    if (!result) {
      if (req.file) await deleteImage(req.file.filename);

      return resp.status(404).json({
        message: "Product update failed"
      });
    }

    // Delete old image only after successful DB update
    if (newImage && oldProduct.productImage) {
      await deleteImage(oldProduct.productImage);
    }

    return resp.status(200).json({
      message: "Product updated successfully",
      data: result
    });

  } catch (error) {
    // If DB update fails, remove newly uploaded image
    if (req.file) {
      await deleteImage(req.file.filename);
    }

    if (error.code === 11000) {
      return resp.status(409).json({
        message: "SKU already exists"
      });
    }

    return resp.status(500).json({
      message: error.message
    });
  }
}
