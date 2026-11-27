import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("EMAIL:", process.env.APP_EMAIL);
console.log("PASSWORD EXISTS:", Boolean(process.env.APP_PASSWORD));

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

export default transport;