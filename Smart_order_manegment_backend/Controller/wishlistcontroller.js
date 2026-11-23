import {
  remove_wishlist,
  add_wish_list,
  viewwishlist,
  find_single_wishlist,
} from "../Model_API/wishlistapi.js";

export async function remove_wishlist_controller(req, resp) {
  const userId = req.user.user_id;
  const productId = req.params.id;

  try {
    const result = await remove_wishlist(userId, productId);

    if (!result) {
      return resp.status(404).json({
        message: "Wishlist not found",
      });
    }

    return resp.status(200).json({
      message: "Product removed from wishlist successfully",
      data: result,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}

export async function addwishlist(req, resp) {
  const userId = req.user.user_id;
  const productId = req.params.id;

  try {
    const result = await add_wish_list(productId, userId);

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

export async function single_wishlist(req, resp) {
  const productid = req.params.id;

  try {
    const result = await find_single_wishlist(productid);

    if (!result) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    return resp.status(200).json({
      deta: result,
      message: "Product fetched successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
export async function Wishlistt(req, resp) {
  try {
    const result = await viewwishlist();

    if (result) {
      return resp.status(201).json({
        deta: result,
      });
    }
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
