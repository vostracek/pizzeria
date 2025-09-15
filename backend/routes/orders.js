const express = require("express");
const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    await order.populate("items.pizza");

    console.log("Nová objednávka:", order);

    res.status(201).json({
      message: "Objednávka byla úspěšně vytvořena",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Api na novou objednávku
router.post("/", auth, async (req, res) => {
  try {
    const { items, deliveryAddress, phone, notes } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza) {
        return res
          .status(404)
          .json({ error: `Pizza s ID ${item.pizza} nebyla nalezena` });
      }

      const sizeInfo = pizza.sizes.find((s) => s.size === item.size);
      if (!sizeInfo) {
        return res.status(400).json({
          error: `Velikost ${item.size} není dostupná pro ${pizza.name}`,
        });
      }

      const itemTotal = sizeInfo.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        pizza: item.pizza,
        quantity: item.quantity,
        size: item.size,
        price: itemTotal,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      notes,
    });

    await order.save();
    await order.populate("items.pizza user");

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Získa objednávek od uživatele
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("all", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.pizza user")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT změna statusu (pouze admin)
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.pizza user");

    if (!order) {
      return res.status(404).json({ error: "Objednávka nenalezena" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all orders admin
router.get("/all", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.pizza")
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log("Error in /all endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
