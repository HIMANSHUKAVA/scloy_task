import add_to_cart_model from "../Model/addtocartmodel.js";

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

export async function viewcart(userid) {
  try {
    const result = await add_to_cart_model
      .findOne({ userId: userid})

    return result;
  } catch (error) {
    throw error;
  }
}
export async function remove_cart(cartid, userid) {
  const result = add_to_cart_model.findByIdAndDelete(cartid, userid);

  return result;
}
