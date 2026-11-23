import wishlist_model from "../Model/Wishlist.js";
import product_model from "../Model/ProductModel.js"

export async function add_wish_list(productid, userid) {
  try {
    const result = await wishlist_model.findOneAndUpdate(
      { userId: userid },
      {
        $addToSet: {
          products: { productId: productid },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return result;
  } catch (error) {
    throw error;
  }
}

export async function viewwishlist() {
  
  return wishlist_model.find();
}



export async function find_single_wishlist(productid) {
 
  return product_model.findById(productid);
}

export async function remove_wishlist(userId, productId) {
  try {
    const result = await wishlist_model.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: { productId },
        },
      },
      { new: true },
    );

    return result;
  } catch (error) {
    throw error;
  }
}
