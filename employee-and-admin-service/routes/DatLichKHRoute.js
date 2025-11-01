const express = require('express');
const router = express.Router();
const { 
  createDatLichController, 
  getAllDatLichController, 
  getDatLichByIdController,
  updateDatLichController,
  deleteDatLichController
} = require('../controllers/DatLichKHController');

// Route to create a new booking
router.post('/create', async (req, res) => {
  try {
    const result = await createDatLichController(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all bookings
router.get('/all', async (req, res) => {
  try {
    const bookings = await getAllDatLichController();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await getDatLichByIdController(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await updateDatLichController(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteDatLichController(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
