const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Povinné pole (registrace bez jména neprojde)
      trim: true,  // Automaticky odstraní mezery na začátku/konci
    },
    email: {
      type: String,
      required: true,
      unique: true,  // V databázi může být jen jeden email (indexuje pole)
      lowercase: true, // Automaticky převede na malá písmena
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"], // Povoluje jen tyto hodnoty
      default: "customer", // Pokud nezadáme, bude customer
    },
    phone: String,
    address: {
      street: String, // Vnořený objekt - nepovinné pole
      city: String, // Typ jen String (bez required)
      zipCode: String,
    },
  },
  {
    timpestamps: true,
  }
);



userSchema.pre("save", async function (next) {    
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
