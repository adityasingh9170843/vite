import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";


export const protect = async(req, res, next) => {
  // Only accept token from cookie (JWT stored in cookie)
  const token = req.cookies?.token;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findOne({ email: decoded.email }).select("-password");
    req.LoggedInUser = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized");
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const actor = req.user || req.LoggedInUser || req.engineer;
    if (!actor || !roles.includes(actor.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};