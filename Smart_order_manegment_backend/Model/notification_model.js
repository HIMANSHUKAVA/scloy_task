import mongoose, { model } from "mongoose"
import notification_schema from "../Schema/Notification.js"



const not_model = model("notification" , notification_schema , "notification")

export default  not_model