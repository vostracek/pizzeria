const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('./models/Pizza');

dotenv.config();

const realPizzas = [
  {
    name: "MARGHERITA",
    description: "Italské rajčata san marzano, bazalka, olivový olej, sůl",
    price: 140,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
    category: "klasické",
    ingredients: ["rajčatová omáčka", "mozzarella", "bazalka", "olivový olej"],
    available: true
  },
  {
    name: "FUNGHI",
    description: "Čerstvé žampiony, česnek, petržel, olivový olej",
    price: 140,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
    category: "vegetariánské",
    ingredients: ["rajčatová omáčka", "mozzarella", "žampiony", "česnek", "petržel"],
    available: true
  },
  {
    name: "GORGONZOLA",
    description: "Gorgonzola sýr, ořechy, med",
    price: 190,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    category: "speciální",
    ingredients: ["rajčatová omáčka", "mozzarella", "gorgonzola", "ořechy", "med"],
    available: true
  },
  {
    name: "SPINACI",
    description: "Čerstvý špenát, ricotta, česnek",
    price: 160,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    category: "vegetariánské",
    ingredients: ["rajčatová omáčka", "mozzarella", "špenát", "ricotta", "česnek"],
    available: true
  },
  {
    name: "PROSCIUTTO",
    description: "Parma šunka, rukola, parmazán",
    price: 210,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500",
    category: "meat",
    ingredients: ["rajčatová omáčka", "mozzarella", "prosciutto", "rukola", "parmazán"],
    available: true
  },
  {
    name: "QUATTRO FORMAGGI",
    description: "Čtyři druhy sýrů - mozzarella, gorgonzola, parmazán, pecorino",
    price: 190,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500",
    category: "speciální",
    ingredients: ["mozzarella", "gorgonzola", "parmazán", "pecorino"],
    available: true
  },
  {
    name: "PEPPERONI",
    description: "Pikantní salám pepperoni, olivy",
    price: 170,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    category: "meat",
    ingredients: ["rajčatová omáčka", "mozzarella", "pepperoni", "olivy"],
    available: true
  },
  {
    name: "NAPOLETANA",
    description: "Ančovičky, kapary, olivy, oregano",
    price: 170,
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500",
    category: "klasické",
    ingredients: ["rajčatová omáčka", "mozzarella", "ančovičky", "kapary", "olivy", "oregano"],
    available: true
  },
  {
    name: "PROSCIUTTO & RUCOLA",
    description: "Prosciutto di Parma, čerstvá rukola, parmazán, olivový olej",
    price: 210,
    image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=500",
    category: "meat",
    ingredients: ["rajčatová omáčka", "mozzarella", "prosciutto di Parma", "rukola", "parmazán"],
    available: true
  },
  {
    name: "CALZONE FORMAGGIO",
    description: "Zavřená pizza plněná třemi sýry",
    price: 170,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500",
    category: "speciální",
    ingredients: ["mozzarella", "ricotta", "parmazán", "bazalka"],
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Připojeno k MongoDB');
    
    await Pizza.deleteMany({});
    console.log('🗑️ Staré pizzy smazány');
    
    const createdPizzas = await Pizza.insertMany(realPizzas);
    console.log(`🍕 Přidáno ${createdPizzas.length} pizz podle reálného menu`);
    
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