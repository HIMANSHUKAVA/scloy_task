import e from "express";
import { getorderdetails } from "../Controller/OrderController.js";

const router = e.Router();


router.get("/check-order" , getorderdetails);

export default router;