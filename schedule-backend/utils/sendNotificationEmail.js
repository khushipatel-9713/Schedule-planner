import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendNotificationEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"📅 Schedule Planner" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};
