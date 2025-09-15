const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('./models/Pizza');

dotenv.config();

const seedPizzas = [
  {
    name: "Margherita",
    description: "Klasická italská pizza s rajčaty, mozzarellou a bazalkou",
    price: 180,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
    category: "klasické",
    ingredients: ["rajčatová omáčka", "mozzarella", "bazalka", "olivový olej"],
    sizes: [
      { size: "malá", price: 180 },
      { size: "střední", price: 220 },
      { size: "velká", price: 280 }
    ],
    available: true
  },
  {
    name: "Pepperoni",
    description: "Pikantní pizza s pepperoni salámem a extra sýrem",
    price: 220,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    category: "meat",
    ingredients: ["rajčatová omáčka", "mozzarella", "pepperoni salám"],
    sizes: [
      { size: "malá", price: 220 },
      { size: "střední", price: 260 },
      { size: "velká", price: 320 }
    ],
    available: true
  },
  {
    name: "Vegetariánská",
    description: "Čerstvá zelenina s mozzarellou a bazalkou",
    price: 200,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
    category: "vegetariánské",
    ingredients: ["rajčatová omáčka", "mozzarella", "paprika", "žampiony", "cibule", "olivy"],
    sizes: [
      { size: "malá", price: 200 },
      { size: "střední", price: 240 },
      { size: "velká", price: 300 }
    ],
    available: true
  }
];

const seedDatabase = async () => {
  try {
    // Připojí se k databázi
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Připojeno k MongoDB');

    // Smaže všechny staré pizzy
    await Pizza.deleteMany({});
    console.log('🗑️ Staré pizzy smazány');

    // Přidá nové pizzy
    const createdPizzas = await Pizza.insertMany(seedPizzas);
    console.log(`🍕 Přidáno ${createdPizzas.length} pizz`);

    // Vypíše názvy přidaných pizz
    createdPizzas.forEach(pizza => {
      console.log(`✅ ${pizza.name} - ${pizza.price} Kč`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Chyba při seedování:', error);
    process.exit(1);
  }
};

seedDatabase();