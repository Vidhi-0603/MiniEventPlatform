const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const cookieParser = require("cookie-parser");

app.use(cookieParser()); 

const authRoutes = require("./src/routes/auth.route");
const connectDB = require("./src/config/mongo.config.js");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

connectDB().then(() => {
  console.log("✅ DB promise resolved");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});