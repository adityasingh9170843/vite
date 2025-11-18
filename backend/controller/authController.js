import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const sanitizeInput = (input) => {
  return input.trim();
};

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedProfileImageUrl = profileImageUrl ? sanitizeInput(profileImageUrl) : null;

    if (!sanitizedEmail || !sanitizedName || !password) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    const ExistedUser = await UserModel.findOne({ email: sanitizedEmail });
    if (ExistedUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          res.status(400);
          throw new Error("Error hashing password");
        }
        const user = await UserModel.create({
          name: sanitizedName,
          email: sanitizedEmail,
          password: hash,
          profileImageUrl: sanitizedProfileImageUrl,
        });
        let token = generateToken(user);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, 
          sameSite: "None",
        });
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          token,
        });
        console.log(token);
      });
    });
  } catch (error) {
    res.status(400);
    res.json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const sanitizedEmail = sanitizeInput(email);

    if (!sanitizedEmail || !password) {
      res.status(400);
      throw new Error("Missing email or password");
    }

    const user = await UserModel.findOne({ email: sanitizedEmail });
    if (!user) {
      res.status(400);
      return res.json({ message: "No records found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(400).json({ message: "Password not matched" });
      } else if (result) {
        let token = generateToken(user);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, 
          sameSite: "None",
        });
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          token,
        });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    });
  } catch (error) {
    res.status(400);
    res.json({ error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    // Generate simple seeded/sample data for the dashboard
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ];

    const salesByMonth = [1200, 1900, 1500, 2200, 2400, 2000];

    // Summary metrics derived from aggregated sample data
    const totalSales = salesByMonth.reduce((a, b) => a + b, 0);
    const totalOrders = 320; // sample
    const inventoryCount = 540; // sample

    // Table rows (sample)
    const tableRows = [
      { date: "2025-06-01", product: "Widget A", category: "Gadgets", amount: 120 },
      { date: "2025-06-03", product: "Widget B", category: "Gadgets", amount: 220 },
      { date: "2025-05-30", product: "Gizmo X", category: "Widgets", amount: 180 },
      { date: "2025-05-25", product: "Gizmo Y", category: "Widgets", amount: 95 },
      { date: "2025-04-12", product: "Thingamajig", category: "Accessories", amount: 45 },
      { date: "2025-03-22", product: "Doohickey", category: "Accessories", amount: 75 },
      { date: "2025-02-14", product: "Contraption", category: "Devices", amount: 300 },
    ];

    res.status(200).json({
      metrics: {
        totalSales,
        totalOrders,
        inventoryCount,
      },
      chart: {
        labels: months,
        data: salesByMonth,
      },
      table: tableRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = req.LoggedInUser;

    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400);
    console.log("Got error", error);
    res.json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400);
    console.log("Got error", error);
    res.json({ error: error.message });
  }
};
