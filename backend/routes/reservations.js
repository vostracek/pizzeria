const express = require('express');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// POST vytvoření rezervace (veřejné)
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    
    // Zde by se poslal email majiteli pizzerie
    console.log('Nová rezervace:', reservation);
    
    res.status(201).json({
      message: 'Rezervace byla úspěšně vytvořena',
      reservation
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET všechny rezervace (pouze admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT změna statusu rezervace (pouze admin)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ error: 'Rezervace nenalezena' });
    }
    
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;