const express = require('express');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// POST /api/reservations - vytvoření rezervace (VEŘEJNÉ - bez auth)
router.post('/', async (req, res) => {
  try {
    console.log('Přijata rezervace:', req.body);
    
    const { date, time, guests, name, phone, email, notes } = req.body;
    
    // VALIDACE
    if (!date || !time || !guests || !name || !phone || !email) {
      return res.status(400).json({ 
        error: 'Vyplňte všechna povinná pole' 
      });
    }

    // VYTVOŘENÍ REZERVACE
    const reservation = new Reservation({
      date: new Date(date),
      time,
      guests: parseInt(guests),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      notes: notes ? notes.trim() : ''
    });
    
    await reservation.save();
    
    console.log('Rezervace vytvořena:', reservation);
    
    res.status(201).json({
      message: 'Rezervace byla úspěšně vytvořena',
      reservation
    });
  } catch (error) {
    console.error('Chyba při vytváření rezervace:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/reservations - všechny rezervace (POUZE ADMIN)
router.get('/', auth, admin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ date: 1, time: 1 });
    
    console.log(`Načteno ${reservations.length} rezervací`);
    res.json(reservations);
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reservations/:id/status - změna statusu (POUZE ADMIN)
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
    
    console.log(`Status rezervace ${reservation._id} změněn na: ${status}`);
    res.json(reservation);
  } catch (error) {
    console.error('Chyba při změně statusu rezervace:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;