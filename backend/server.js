const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Replace with your actual frontend URL
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials like cookies (if needed)
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Replace with your actual frontend URL
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true); // If you need to allow credentials like cookies

  if (req.method === "OPTIONS") {
    res.sendStatus(200); // Respond to preflight request
  } else {
    next();
  }
});

app.use(express.static("public"));

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://marvydee1:Marvydee.1@serviceguru.mtf9sjz.mongodb.net/?retryWrites=true&w=majority&appName=Serviceguru",
    {}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Service Provider Schema
const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  phone: { type: String, required: true },
  service: { type: String, required: true },
});

serviceProviderSchema.index({ location: "2dsphere" });

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

// Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, location, phone, service } = req.body;
    const newProvider = new ServiceProvider({
      name,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
      phone,
      service,
    });
    await newProvider.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { location, service } = req.body;
    const providers = await ServiceProvider.find({
      service: new RegExp(service, "i"),
      location: {
        $geoWithin: {
          $centerSphere: [[location.lng, location.lat], 10 / 3963.2], // 10 miles radius
        },
      },
    });
    res.json({ success: true, providers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
