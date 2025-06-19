import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"; // Assuming you have a routes file
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js";
import cors from "cors";

const app = express();

// Load environment variables
dotenv.config();


app.use(cors({
    origin:"http://localhost:5173",
    credentials: true // allow frontend to send the cookies
}))
// Middleware to parse JSON bodies
app.use(express.json()); // Add this to parse JSON request bodies
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes); // Example route setup
app.use("/api/users", userRoutes); // Example route setup
app.use("/api/chat", chatRoutes); // Example route setup

// Connect to MongoDB
mongoose
    .connect(process.env.Mongo_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});