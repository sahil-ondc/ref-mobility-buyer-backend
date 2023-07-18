/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import User from '../database/models/User';
import { loginSchema } from '../utilities/Validator';

const login = async (req, res) => {
  try {
    const requestedBody = req.body;
    await loginSchema.validate(requestedBody);
    const { email, password } = requestedBody;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid Email' });
    }
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Password' });
    }

    // create a token
    const payload = {
      user: {
        // eslint-disable-next-line no-underscore-dangle
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
    if (process.env.JWT_SECRET_KEY) {
      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            message: 'Login Success',
            data: { token, user },
            success: true,
          });
        },
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};
const signUp = async (req, res) => {
  try {
    const {
      name, email, password, phone,
    } = req.body;

    // check if the user is exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'User Already Exists' });
    }

    // encode the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // save user to db
    user = new User({
      name,
      email,
      password: passwordHash,
      phone,
    });
    await user.save();

    const payload = {
      user: {
        id: user?._id,
        name: user.name,
        email: user.email,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      message: 'Signup Success',
      data: { token },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { googleAccessToken } = req.body;
    const decoded = jwtDecode(googleAccessToken);
    const currentUser = await User.findOne({
      email: decoded?.email,
    });
    if (!currentUser) {
      const user = new User({
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
      await user.save();
      const payload = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
      });

      return res.status(200).json({
        message: 'Login Success',
        data: { token, user },
        success: true,
      });
    }
    const payload = {
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      message: 'Login Success',
      data: { token, user: currentUser },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};
const userDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    return res.status(200).json({
      message: 'User Details',
      data: user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};
const updateUserDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customField, data } = req.body;
    const filter = { _id: userId };
    const update = { [customField]: data };
    const user = await User.findByIdAndUpdate(filter, update, {
      returnOriginal: false,
    });
    return res.status(200).json({
      message: 'User details has been updated',
      data: user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message ? error.message : error,
    });
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userDetail } = req.body;

    const user = await User.findByIdAndUpdate(userId, userDetail, {
      returnOriginal: false,
    });
    return res.status(200).json({
      message: 'User details has been updated',
      data: user,
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
  login,
  signUp,
  googleLogin,
  userDetails,
  updateUserDetail,
  updateUserDetails,
};
