import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './utils/dbConnect.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';

dotenv.config({ quiet: true });


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on port ${process.env.PORT}`);
});
