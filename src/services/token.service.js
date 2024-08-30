/* eslint-disable no-else-return */
const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token, OTP, OTPLogin } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const getUserbyMail = async (emails) => {
  const otp = OTP.findOne({ email: emails });
  return otp;
};
const getUserbyMailotpLogin = async (emails) => {
  const otp = OTPLogin.findOne({ email: emails });
  return otp;
};
const getUserbyOTP = async (otps) => {
  const otp = OTP.findOne({ otp: otps });
  return otp;
};
const getUserbyToken = async (tokens) => {
  const otp = OTP.findOne({ token: tokens });
  return otp;
};
const updateUserById = async (emails, updateBody) => {
  const user = await getUserbyMail(emails);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
const updateUserByIdLogin = async (emails, updateBody) => {
  const user = await getUserbyMailotpLogin(emails);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
const saveOTP = async (emails, expires, otpnumber, tokens, userid) => {
  const user = await getUserbyMail(emails);
  const body = {
    email: emails,
    expirytime: expires.toDate(),
    otp: otpnumber,
    token: tokens,
    userId: userid,
  };
  if (!user) {
    const otpDoc = await OTP.create(body);
    return otpDoc;
  } else {
    const updateotp = await updateUserById(emails, body);
    return updateotp;
  }
};
const saveOTPLogin = async (emails, expires, otpnumber, tokens, userid) => {
  const user = await getUserbyMailotpLogin(emails);
  const body = {
    email: emails,
    expirytime: expires.toDate(),
    otp: otpnumber,
    token: tokens,
    userId: userid,
  };
  if (!user) {
    const otpDoc = await OTPLogin.create(body);
    return otpDoc;
  } else {
    const updateotp = await updateUserByIdLogin(emails, body);
    return updateotp;
  }
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email, otp) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  const saveOtp = await saveOTP(email, expires, otp, resetPasswordToken, user.id);
  return saveOtp;
};
const generateResetPasswordTokenOtpLogin = async (email, otp) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  const saveOtp = await saveOTPLogin(email, expires, otp, resetPasswordToken, user.id);
  return saveOtp;
};
/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};



const getUserFromToken = async (tokenValue) => {
  try {
    // Find the token in the database
    const token = await Token.findOne({ token: tokenValue, blacklisted: false }).populate('user').exec();
    return token;

    if (!token) {
      throw new Error('Token not found or blacklisted');
    }

    // Check if the token has expired
    if (token.expires < Date.now()) {
      throw new Error('Token has expired');
    }

    // Return the associated user
    return token.user;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to authenticate user with the provided token');
  }
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  getUserbyMail,
  getUserbyOTP,
  getUserbyToken,
  generateResetPasswordTokenOtpLogin,
  getUserbyMailotpLogin,
  getUserFromToken
};
