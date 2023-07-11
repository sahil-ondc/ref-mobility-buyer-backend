import AuthService from '../services/AuthService';

const login = async (req, res, next) => {
  try {
    await AuthService.login(req, res);
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    await AuthService.signUp(req, res);
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    await AuthService.googleLogin(req, res);
  } catch (error) {
    next(error);
  }
};

const userDetails = async (req, res, next) => {
  try {
    await AuthService.userDetails(req, res);
  } catch (error) {
    next(error);
  }
};

const updateUserDetails = async (req, res, next) => {
  try {
    await AuthService.updateUserDetails(req, res);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  signUp,
  googleLogin,
  userDetails,
  updateUserDetails,
};
