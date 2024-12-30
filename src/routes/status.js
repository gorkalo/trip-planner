const express = require('express');
const router = express.Router();
require('../swagger/status');

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

module.exports = router;
