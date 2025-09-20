const express = require("express");
const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const emailService = require("../services/emailService");
const router = express.Router();

// POST /api/orders - vytvoření objednávky (VEŘEJNÉ - bez auth)
router.post("/", async (req, res) => {
  try {
    console.log("Přijata objednávka:", req.body);

    const { items, customerInfo, orderType, totalPrice, deliveryFee } = req.body;

    // VALIDACE POLOŽEK
    const validatedItems = [];
    for (let item of items) {
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza) {
        return res.status(404).json({
          error: `Pizza s ID ${item.pizza} nebyla nalezena`,
        });
      }

      // Validace ceny
      if (item.price !== pizza.price) {
        console.warn(
          `Rozdílná cena pro ${pizza.name}: očekáváno ${pizza.price}, přijato ${item.price}`
        );
      }

      validatedItems.push({
        pizza: item.pizza,
        quantity: item.quantity,
        price: pizza.price, // Použij cenu z databáze
      });
    }

    // VYTVOŘENÍ OBJEDNÁVKY
    const order = new Order({
      items: validatedItems,
      customerInfo,
      orderType,
      totalPrice,
      deliveryFee: deliveryFee || 0,
    });

    await order.save();
    await order.populate("items.pizza");

    // POŠLI EMAILY
    try {
      if (customerInfo.email) {
        await emailService.sendOrderConfirmation(order);
        console.log(`Potvrzení objednávky odesláno na: ${customerInfo.email}`);
      }
      await emailService.sendNewOrderNotification(order);
      console.log("Notifikace majiteli odeslána");
    } catch (emailError) {
      console.error("Chyba při odesílání emailů:", emailError);
      // Nepřeruš proces - objednávka je uložená
    }

    console.log("Objednávka vytvořena:", order.orderNumber || order._id);

    res.status(201).json({
      message: "Objednávka byla úspěšně vytvořena",
      order,
    });
  } catch (error) {
    console.error("Chyba při vytváření objednávky:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/orders - získá objednávky uživatele (S AUTH)
router.get("/", auth, async (req, res) => {
  try {
    // Najdi objednávky podle emailu uživatele
    const orders = await Order.find({
      "customerInfo.email": req.user.email,
    })
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Chyba při načítání objednávek:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/all - všechny objednávky (POUZE ADMIN)
router.get("/all", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    console.log(`Načteno ${orders.length} objednávek`);
    res.json(orders);
  } catch (error) {
    console.error("Chyba při načítání všech objednávek:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/status - změna statusu (POUZE ADMIN)
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.pizza");

    if (!order) {
      return res.status(404).json({ error: "Objednávka nenalezena" });
    }

    console.log(`Status objednávky ${order.orderNumber || order._id} změněn na: ${status}`);
    res.json(order);
  } catch (error) {
    console.error("Chyba při změně statusu:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;