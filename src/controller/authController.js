import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../config/email.js";

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────
export const signupController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email and password are required." });
    }

    const validRoles = ["CANDIDATE", "RECRUITER", "ADMIN"];
    const userRole = role && validRoles.includes(role.toUpperCase()) ? role.toUpperCase() : "CANDIDATE";

    // Check if email already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ msg: "Email is already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, hash_password, role, is_verified, otp) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, userRole, false, otp]
    );

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      msg: "Registration successful. OTP sent to your email. Please verify to activate your account.",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ msg: "Internal server error during signup." });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/verify-otp
// ─────────────────────────────────────────────
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.status(400).json({ msg: "Email is already verified." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }

    // Mark user as verified and clear OTP
    await pool.query(
      "UPDATE users SET is_verified = true, otp = NULL WHERE email = ?",
      [email]
    );

    return res.status(200).json({ msg: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ msg: "Internal server error during OTP verification." });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/resend-otp
// ─────────────────────────────────────────────
export const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.status(400).json({ msg: "Email is already verified." });
    }

    const newOtp = generateOtp();

    await pool.query("UPDATE users SET otp = ? WHERE email = ?", [newOtp, email]);
    await sendOtpEmail(email, newOtp);

    return res.status(200).json({ msg: "New OTP sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ msg: "Internal server error while resending OTP." });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const user = users[0];

    if (!user.is_verified) {
      return res.status(403).json({
        msg: "Email not verified. Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.hash_password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({
      msg: "Login successful.",
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error during login." });
  }
};

// ─────────────────────────────────────────────
// GET /api/auth/current-user  (protected)
// ─────────────────────────────────────────────
export const getCurrentUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.query(
      "SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// GET /api/auth/:id  (protected)
// ─────────────────────────────────────────────
export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      "SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/logout  (protected)
// ─────────────────────────────────────────────
export const logoutController = async (req, res) => {
  // JWT is stateless — client should delete the token on their end.
  // For future enhancement: add token to a blacklist table.
  return res.status(200).json({ msg: "Logged out successfully. Please delete your token on the client." });
};

// ─────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }

    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      // Return 200 even if not found — security best practice (don't reveal user existence)
      return res.status(200).json({ msg: "If this email is registered, a reset OTP has been sent." });
    }

    const otp = generateOtp();
    await pool.query("UPDATE users SET otp = ? WHERE email = ?", [otp, email]);
    await sendPasswordResetEmail(email, otp);

    return res.status(200).json({ msg: "Password reset OTP sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────
export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    const user = users[0];

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET hash_password = ?, otp = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    return res.status(200).json({ msg: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ msg: "Internal server error during password reset." });
  }
};
