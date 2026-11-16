import order from "../Model/OrderModel.js";

export async function Getorderdetail() {
    const result = order.find();
    return result;
}