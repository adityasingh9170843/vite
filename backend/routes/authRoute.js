import express from "express";
import { registerUser,loginUser,getUserProfile,logoutUser, getDashboardData } from "../controller/authController.js";
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();


router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',protect,getUserProfile)
router.post('/logout', logoutUser); 
router.get('/dashboard', protect, getDashboardData);



export default router