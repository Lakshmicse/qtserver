const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const getUserByToken = catchAsync(async (req, res) => {
 
  const usr = req.user;
  
  res.status(httpStatus.OK).send(usr);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const otpnumber = Math.floor(1000 + Math.random() * 9000);
  // eslint-disable-next-line no-unused-vars
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email, otpnumber);
  await emailService.sendResetPasswordEmail(req.body.email, otpnumber, resetPasswordToken.token);
  res.send(resetPasswordToken);
});
const otpLogin = catchAsync(async (req, res) => {
  const otpnumber = Math.floor(1000 + Math.random() * 9000);
  // eslint-disable-next-line no-unused-vars
  const resetPasswordToken = await tokenService.generateResetPasswordTokenOtpLogin(req.body.email, otpnumber);
  await emailService.sendResetPasswordEmailOTPLogin(req.body.email, otpnumber, resetPasswordToken.token);
  res.send(resetPasswordToken);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
const getuserotpbymail = catchAsync(async (req, res) => {
  const otp = await tokenService.getUserbyMail(req.params.email);
  res.send(otp);
});
const getuserotpbyotp = catchAsync(async (req, res) => {
  const otp = await tokenService.getUserbyOTP(req.params.otp);
  res.send(otp);
});
const getuserotpbytoken = catchAsync(async (req, res) => {
  const otp = await tokenService.getUserbyToken(req.params.token);
  res.send(otp);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getuserotpbymail,
  getuserotpbyotp,
  getuserotpbytoken,
  otpLogin,
  getUserByToken
};
