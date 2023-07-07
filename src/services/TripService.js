/* eslint-disable consistent-return */
import Trip from '../database/models/Trip';

const createTrip = async (req, res) => {
  try {
    const RequestedPayload = req.body;
    const TripExist = await Trip.findOne({
      transaction_id: RequestedPayload?.transaction_id,
    });
    const userId = req.user.id;

    if (TripExist) {
      return res
        .status(400)
        .json({ success: false, message: 'Trip Already Exists' });
    }

    const trip = new Trip({
      user: userId,
      driver: RequestedPayload.driver,
      qoute: RequestedPayload.qoute,
      location: RequestedPayload.location,
      vehicle: RequestedPayload.vehicle,
      transaction_id: RequestedPayload.transaction_id,
      bpp_uri: RequestedPayload.bpp_uri,
      fulfillment_id: RequestedPayload.fulfillment_id,
      provider_id: RequestedPayload.provider_id,
      order_id: RequestedPayload.order_id,
    });

    await trip.save();
    return res.status(200).json({
      message: 'Trip Created Successfully',
      data: trip,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await Trip.find({
      user: userId,
    });
    if (!trips) {
      return res.status(200).json({
        message: 'No Trips Found',
        success: true,
      });
    }

    return res.status(200).json({
      message: 'List of Trips.',
      data: trips,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};

export default {
  createTrip,
  getAllTrips,
};
