import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"JobConnect" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your JobConnect OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a237e;">JobConnect</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 15px;">Use the OTP below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #3949ab;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #888;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"JobConnect" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "JobConnect Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a237e;">JobConnect — Password Reset</h2>
        <p style="font-size: 15px;">Use the OTP below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #b71c1c;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #888;">This OTP is valid for <strong>10 minutes</strong>.</p>
        <p style="font-size: 12px; color: #aaa;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
