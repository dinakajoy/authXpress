import nodemailer from "nodemailer";
import config from "config";

const user = config.get("emailConfig.user") as string;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass: config.get("emailConfig.password"),
  },
});

export default transporter;
