/* eslint-disable consistent-return */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
    const { name, email, password } = req.body;

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
    });
    await user.save();

    const payload = {
      user: {
        // eslint-disable-next-line no-underscore-dangle
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
    });
  } catch (error) {
    return error;
  }
};

export default {
  login,
  signUp,
};
