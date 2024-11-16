// routes/cars.js
const express = require("express");
const Car = require("./Cars");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// PUT /cars/:id route - Update car
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const carId = req.params.id;
    const { make, model, year, color } = req.body;

    // Validate the required fields
    if (!make || !model || !year || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the car and update it
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { make, model, year, color },
      { new: true } // Return the updated car
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Return the updated car
    res.json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
