const mongoose = require('mongoose');



const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['klasické', 'meat', 'vegetariánské', 'vegánské', 'speciální'],
    default: 'klasické'
  },
  ingredients: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Exportujeme model
module.exports = mongoose.model('Pizza', pizzaSchema);