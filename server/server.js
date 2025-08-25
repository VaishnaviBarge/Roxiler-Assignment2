const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");   
const adminRoutes = require("./routes/admin"); 
const userRoutes = require("./routes/user");
const storeRouter = require("./routes/store");
const app = express();
app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user",userRoutes);
app.use("/store",storeRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
