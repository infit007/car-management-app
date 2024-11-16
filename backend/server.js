const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors for cross-origin requests
const authenticate = require("./middleware/authenticateToken"); // Import the authenticate middleware
const authRoutes = require("./routes/auth"); // Import authentication routes

// Initialize the express app
const app = express();
const port = 5000;

// Use middleware
app.use(express.json()); // Use express's built-in JSON parser
app.use(cors()); // Allow cross-origin requests

// MongoDB connection URL
const mongoURL = "mongodb://localhost:27017/carDB";

// Connect to MongoDB
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define Car schema
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  color: String,
});

// Create Car model
const Car = mongoose.model("Car", carSchema);

// Route to get all cars (Public)
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch cars: " + err.message });
  }
});

// Route to add a new car (Protected)
app.post("/cars", authenticate, async (req, res) => {
  // Validate required fields
  if (!req.body.make || !req.body.model || !req.body.year || !req.body.color) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newCar = new Car({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
  });

  try {
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: "Error saving car: " + err.message });
  }
});

// Route to update an existing car (Protected)
app.put("/cars/:id", authenticate, async (req, res) => {
  const { make, model, year, color } = req.body;
  if (!make || !model || !year || !color) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { make, model, year, color },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: "Error updating car: " + err.message });
  }
});

// Include authentication routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
