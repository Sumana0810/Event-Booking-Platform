const express = require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const authRoutes=require("./routes/auth.js");
const eventRoutes=require("./routes/events.js");
const bookingRoutes=require("./routes/bookings.js");
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/bookings",bookingRoutes);

//mongoDB connection 
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.error("Error connecting to MongoDB:",error);
})

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});