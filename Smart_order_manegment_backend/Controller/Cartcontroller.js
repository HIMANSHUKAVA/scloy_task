import { Addcart, remove_cart, viewcart } from "../Model_API/addtocartapi.js";

export async function Add_Cart(req, resp) {
  const userId = req.user.user_id;
  const productId = req.params.id;

  try {
    const result = await Addcart(userId, productId);

    if (result) {
      return resp.status(200).json({
        message: "Product saved from wishlist successfully",
        data: result,
      });
    }
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}

export async function viewlist(req, resp) {
  try {
    const result = await viewcart(req.user.user_id);

    if (!result) {
      return resp.status(404).json({
        message: "Cart not found",
        data: [],
      });
    }

    return resp.status(200).json({
      message: "Fetched successfully",
      data: result,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}

export async function removecart(req, resp) {
  try {
    const userId = req.user.user_id;
    const id = req.params.id;

    const result = await remove_cart(id, userId);

    if (!result) {
      return resp.status(404).json({
        message: "Product not found in cart",
      });
    }

    return resp.status(200).json({
      message: "Product removed successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
