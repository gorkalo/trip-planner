require('dotenv').config();
const axios = require('axios');
const { AVAILABLE_COUNTRY_CODES, SORT_BY_OPTIONS } = require("../config/constants");
const client = require('../../prisma/client');

exports.getTrip = async (req, res, next) => {
  try {
    
    const { origin, destination, sort_by = 'fastest' } = req.query;

    if (!AVAILABLE_COUNTRY_CODES.includes(origin) || !AVAILABLE_COUNTRY_CODES.includes(destination)) {
      return res.status(400).json({ error: 'Invalid origin or destination' })
    }

    if (!SORT_BY_OPTIONS.includes(sort_by)) {
      return res.status(400).json({ error: 'Invalid sort by option' })
    }

    const response = await axios.get(
      'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips', 
        {
          headers: {
            'x-api-key': process.env.TRIPS_API_KEY
          },
          params: {
            origin,
            destination
          }
        }
    );

    const sortedTrips = response.data.sort((a, b) => {
      if (sort_by === 'fastest') {
        return a.duration - b.duration
      } else if (sort_by === 'cheapest') {
        return a.cost - b.cost
      }
    })

    if (sortedTrips.length === 0) {
      return res.status(404).json({ error: 'No trips found' })
    }

    return res.status(200).json(sortedTrips)
  } catch (err) {
    next(err);
  }
};

exports.saveTrip = async (req, res, next) => {
  try {
    const user = req.user;
    const trip_id = req.body.trip_id;

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (!trip_id) {
      return res.status(400).json({ error: 'Trip ID is required' })
    }

    const trip = await client.trip.findUnique({
      where: {
        userId_trip_id: {
          userId: user.id,
          trip_id,
        },
      },
    });

    if (trip) {
      return res.status(400).json({ error: 'Trip already saved' })
    }

    const response = await axios.get(
      'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips', 
        {
          headers: {
            'x-api-key': process.env.TRIPS_API_KEY
          },
          params: {
            id: trip_id
          }
        }
    );
    const data = response?.data;

    if (!data) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    delete data.id;
    await client.trip.create({
      data: {
        ...data,
        trip_id,
        userId: user.id
      }
    });
    
    return res.status(200).json({ message: 'Trip saved successfully', trip_id })
  } catch (err) {
    next(err);
  }
};

exports.getSavedTrips = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }
    const trips = await client.trip.findMany({
      where: {
        userId: user.id
      }
    });

    if (trips.length === 0) {
      return res.status(404).json({ message: 'No saved trips found' })
    }

    return res.status(200).json(trips)
  } catch (err) {
    next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const user = req.user;
    const trip_id = req.body.trip_id;
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }
    if (!trip_id) {
      return res.status(400).json({ error: 'Trip ID is required' })
    }

    const trip = await client.trip.delete({
      where: {
        userId_trip_id: {
          userId: user.id,
          trip_id,
        },
      },
    });

    if (trip.count === 0) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    return res.status(200).json({ message: 'Trip deleted successfully', trip_id })
  } catch (err) {
    next(err);
  }
};