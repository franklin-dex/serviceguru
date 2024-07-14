const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Allow all origins, change this to specific domain in production
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.static("public"));

// MongoDB connection (update with your new cluster's connection string)
mongoose
  .connect(
    "mongodb+srv://marvydee1:Marvydee.1@serviceguru.mtf9sjz.mongodb.net/?retryWrites=true&w=majority&appName=Serviceguru",
    {}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Service Provider Schema
const serviceProviderSchema = new mongoose.Schema({
  name: String,
  location: { state: String, lga: String }, // Updated to use state and LGA
  phone: number,
  service: String,
});

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
      location: { state: location.state, lga: location.lga },
      phone,
      service,
    });
    await newProvider.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving service provider:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { location, service } = req.body;
    const providers = await ServiceProvider.find({
      service: new RegExp(service, "i"),
      "location.state": location.state,
      "location.lga": location.lga,
    });
    if (providers.length === 0) {
      console.log("No providers found for:", { location, service });
    }
    res.json({ success: true, providers });
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve search.html file
app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
