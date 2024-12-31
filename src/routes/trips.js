const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip');
const authenticate = require('../middlewares/auth');
require('../swagger/trip');

router.get(
  '/trip',
  tripController.getTrip
);

router.post(
  '/save-trip', 
  [authenticate],
  tripController.saveTrip
);

router.get(
  '/saved-trips', 
  [authenticate],
  tripController.getSavedTrips
);

router.delete(
  '/delete-trip', 
  [authenticate],
  tripController.deleteTrip
);

module.exports = router;
