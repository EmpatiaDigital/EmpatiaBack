// routes/testRoute.js
const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: 'Hola desde testRoute es el ackend de empatia este la web oficial 👋' });
});

module.exports = router;
