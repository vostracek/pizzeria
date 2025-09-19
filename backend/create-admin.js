const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const admin = new User({
    name: "Admin",
    email: "admin@pizzafresca.cz",
    password: "admin123",
    role: "admin"
  });
  
  await admin.save();
  console.log('Admin vytvořen!');
  process.exit(0);
}

createAdmin().catch(console.error);