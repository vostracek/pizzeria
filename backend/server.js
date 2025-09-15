const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const pizzaRoutes = require("./routes/pizzas");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders")
const reservationRoutes = require('./routes/reservations');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 MongoDB připojeno úspěšně!");
  } catch (error) {
    console.error("❌ Chyba:", error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Pizza Backend API funguje!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🍕 Backend server běží na portu ${PORT}`);
});
