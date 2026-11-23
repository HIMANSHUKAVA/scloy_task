import {
  Aproved_Request,
  CancelRequest,
  createorder,
  GetAllOderByadmin,
  getmyorders,
  GstSingleOrder,
  Rejectcancelrequest,
  updateorderstatus,
} from "../Model_API/Orders.js";

export async function create_order_user(req, resp) {
  console.log("CREATE ORDER CONTROLLER HIT");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  const { id, quantity } = req.body;
  const userid = req.user.user_id;

  try {
    const result = await createorder({ id, quantity }, userid);

    console.log("ORDER RESULT:", result);

    return resp.status(201).json({
      message: "Order created successfully",
      deta: result,
    });
  } catch (error) {
    console.log("ORDER ERROR:", error);

    return resp.status(500).json({
      message: error.message,
    });
  }
}
export async function fetchorders(req, resp) {
  try {
    const result = await getmyorders();
    if (result) {
      resp.status(200).json({
        message: "fetch deta successfully",
        deta: result,
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: "order get occured problem",
    });
  }
}

export async function findsingleorder(req, resp) {
  try {
    const orderid = req.params.id;
    const userid = req.user.user_id;

    const result = await GstSingleOrder(orderid, userid);

    return resp.status(200).json({
      message: "Order fetched successfully",
      deta: result,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}

export async function orderstatus(req, resp) {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const adminId = req.user.user_id;

    const result = await updateorderstatus(id, status, adminId);

    return resp.status(200).json({
      message: "Order status updated successfully",
      deta: result,
    });
  } catch (error) {
    return resp.status(400).json({
      message: error.message,
    });
  }
}

export async function Getallorderadmin(req, resp) {
  try {
    const result = await GetAllOderByadmin();
    if (result) {
      resp.status(200).json({
        message: "fetch deta successfully",
        deta: result,
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: "order get occured problem",
    });
  }
}

export async function cancelrequest(req, resp) {
  const orderid = req.params.id;
  const userid = req.user.user_id;
  const reason = req.body.reason;

  try {
    const result = await CancelRequest(userid, orderid, reason);

    return resp.status(200).json({
      deta: result,
      message: "Cancellation request sent successfully",
    });
  } catch (error) {
    const statusCode = error.message === "Order not found" ? 404 : 400;

    return resp.status(statusCode).json({
      message: error.message,
    });
  }
}


export async function aproverd_request(req, resp) {
  const orderid = req.params.id;
  const adminid = req.user.user_id;

  try {
    const result = await Aproved_Request(orderid, adminid);

    if (!result) {
      return resp.status(404).json({
        message: "Order not found or request already processed",
      });
    }

    return resp.status(200).json({
      deta: result,
      message: "Cancellation request approved successfully",
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}


export async function reject(req, resp) {
  try {
    const result = Rejectcancelrequest(req.params.id, req.user.user_id);

    if (result) {
      return resp.json({
        message: "request rejectd",
        deta: result,
      });
    }
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
