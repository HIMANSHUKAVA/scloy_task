import { Getorderdetail } from "../Model_API/Order.js";



export async function getorderdetails(req , resp) {
    
    const result = await Getorderdetail();

    resp.status(200).json(result);
}

