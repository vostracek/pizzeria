const express = require("express");
const Pizza = require("../models/Pizza");
const router = express.Router();
const auth = require("../middleware/auth");

// Get /api/pizzas - ziská všechny pizzy
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find(); // NAjde všechny pizzy v DB
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ error: "Pizza nenalezena" });
    }
    res.json(pizza);
  } catch (error) {
    res.status(400).json({ error: "Neplatné ID pizzy" });
  }
});

// POST /api/pizzas - vytvoří novou pizzu
router.post("/", auth, async (req, res) => {
  try {
    const pizza = new Pizza(req.body); // Vytvořží novou pizzu z requestu
    const savedPizza = await pizza.save(); // Uloží do DB
    res.status(201).json(savedPizza);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updatedPizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPizza) {
      return res.status(404).json({ error: "Pizza nenalezena" });
    }
    res.json(updatedPizza);
  } catch (error) {
    res.status(400).json({ error: "Pizza nenalezena" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedPizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!deletedPizza) {
      return res.status(404).json({ error: "Pizza nenalezena" });
    }

    res.json({
      message: "Pizza byla úspešně smazána",
      deletedPizza: deletedPizza,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
