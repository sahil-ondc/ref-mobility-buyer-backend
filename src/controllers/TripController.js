import TripService from '../services/TripService';

const createTrip = async (req, res, next) => {
  try {
    await TripService.createTrip(req, res);
  } catch (error) {
    next(error);
  }
};

const getAllTrips = async (req, res, next) => {
  try {
    await TripService.getAllTrips(req, res);
  } catch (error) {
    next(error);
  }
};

export default {
  createTrip,
  getAllTrips,
};
