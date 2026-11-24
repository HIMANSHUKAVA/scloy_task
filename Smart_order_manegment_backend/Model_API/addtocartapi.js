import add_to_cart_model from "../Model/addtocartmodel.js";
import product_model from "../Model/ProductModel.js";
export async function Addcart(userid, productid) {
  try {
    const result = await add_to_cart_model.findOneAndUpdate(
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

export async function viewcart() {
  try {
    const deta = await add_to_cart_model.find();

    console.log(deta);
    const cart = [];

    for (const item of deta) {
      for (const product of item.products) {
        const cart_deta = await product_model.find(product.productId);

        if (cart_deta) {
          cart.push(cart_deta);
        }
      }
    }

    return cart;
  } catch (error) {
    throw error;
  }
}
export async function remove_cart(productid, userid) {
  const result = await add_to_cart_model.updateOne(
    {
      userId: userid,
      "products.productId": productid,
    },
    {
      $pull: {
        products: {
          productId: productid,
        },
      },
    },
  );

  console.log("Remove Result:", result);

  return result.modifiedCount > 0;
}
