import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Otp from "../models/Otp.model.js";
import { sendNotificationEmail } from "../utils/sendNotificationEmail.js";
dotenv.config();


// -------------------- REGISTER --------------------
// export const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     const token = generateToken(newUser._id);

//     res.status(201).json({
//       message: "Registration successful",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//       },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };

  export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP without crypto
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    const otpDoc = new Otp({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
      data: { name, email, password: hashedPassword },
    });

     const subject = "OTP Verification - Schedule Planner";
    const message = `Hello ${name},\n\nYour OTP for registration is: ${otp}\n\nIt is valid for 5 minutes.\n\n- Team Schedule Planner`;
 
    await otpDoc.save();
    
    await sendNotificationEmail(email, subject, message);

    res.status(200).json({ message: "OTP sent to your Gmail" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};



export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpDoc = await Otp.findOne({ email, otp });

    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { name, password } = otpDoc.data;

    const newUser = new User({ name, email, password });
    await newUser.save();
    await Otp.deleteOne({ _id: otpDoc._id });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Registration successful",
      user: { id: newUser._id, name, email },
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token:token,
      flag : true
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5000/reset-password/${token}`;

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Compose email
    const mailOptions = {
      from: `"Schedule Planner" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (err) {
    res.status(500).json({ message: "Error sending reset email" });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
