const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (too, otpnumber, token) => {
  //   const subject = 'Reset password';
  //   // replace this url with the link to the reset password page of your front-end app
  //   const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  //   const text = `Dear user
  // To reset your password, click on this link: ${resetPasswordUrl}
  // If you did not request any password resets, then ignore this email.`;
  //   await sendEmail(to, subject, text);

  const mailTransporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    // hostname
    secureConnection: false,
    // TLS requires secureConnection to be false
    port: 587,
    // port for secure SMTP
    tls: {
      ciphers: 'SSLv3',
    },
    // service: 'gmail',
    auth: {
      // user: 'hmbharath88@gmail.com',
      // pass: 'flns hyig zxtz jhxn'
      user: 'payrollautomation@pierianservices.com',
      pass: 'Loq42959',
    },
  });

  const mailDetails = {
    from: 'payrollautomation@pierianservices.com',
    to: too,
    subject: 'Reset Passowrd',
    text: 'This mail sent through Node js code',
    html: `<p>Your OTP is <h1>${otpnumber}</h1><b> Click <a href="https://payroll.pierianservices.com/code-verification/code-verification1?token=${token}">here</a> to reset your password <br> </b> <br><b>Note:</b> Please donot reply this email</p>`,
    // html: `<p>Hi ${too},
    // Click <a href="http://localhost:3000/code-verification/code-verification1?token=${token}">here</a> to reset your password</p>

    // We received a request to access your User Account ${too} through your email address. Your Acco verification code is:

    // 904109

    // If you did not request this code, it is possible that someone else is trying to access the Google Account hmbharath88@gmail.com. Do not forward or give this code to anyone.

    // Sincerely yours,

    // The Google Accounts team</p><h1>${otpnumber}</h1>`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } else {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  });
};
const DocumentSharingMail = async (from, too, filename, description) => {
  //   const subject = 'Reset password';
  //   // replace this url with the link to the reset password page of your front-end app
  //   const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  //   const text = `Dear user
  // To reset your password, click on this link: ${resetPasswordUrl}
  // If you did not request any password resets, then ignore this email.`;
  //   await sendEmail(to, subject, text);
  const users = too.join(', ');
  const mailTransporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    // hostname
    secureConnection: false,
    // TLS requires secureConnection to be false
    port: 587,
    // port for secure SMTP
    tls: {
      ciphers: 'SSLv3',
    },
    // service: 'gmail',
    auth: {
      // user: 'hmbharath88@gmail.com',
      // pass: 'flns hyig zxtz jhxn'
      user: 'payrollautomation@pierianservices.com',
      pass: 'Loq42959',
    },
  });

  const mailDetails = {
    from: 'payrollautomation@pierianservices.com',
    to: users,
    subject: 'New Document Received From Pierian Payroll Team',
    text: 'This mail sent through Node js code',
    html: `<p>New Document Shared From : <b>${from}</b> <br><br>New Document File Name: <b>${filename} </b><br><br>Document Description: <b>${description} </b><br><br><b> Click <a href="https://payroll.pierianservices.com/login"s>here</a> to Login and view the File <br> </b> <br><br><br><b>Note:</b> This is auto-genrated email, Please donot reply this email</p>`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } else {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  });
};
// eslint-disable-next-line no-unused-vars
const sendResetPasswordEmailOTPLogin = async (too, otpnumber, token) => {
  //   const subject = 'Reset password';
  //   // replace this url with the link to the reset password page of your front-end app
  //   const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  //   const text = `Dear user
  // To reset your password, click on this link: ${resetPasswordUrl}
  // If you did not request any password resets, then ignore this email.`;
  //   await sendEmail(to, subject, text);

  const mailTransporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    // hostname
    secureConnection: false,
    // TLS requires secureConnection to be false
    port: 587,
    // port for secure SMTP
    tls: {
      ciphers: 'SSLv3',
    },
    // service: 'gmail',
    auth: {
      // user: 'hmbharath88@gmail.com',
      // pass: 'flns hyig zxtz jhxn'
      user: 'payrollautomation@pierianservices.com',
      pass: 'Loq42959',
    },
  });

  const mailDetails = {
    from: 'payrollautomation@pierianservices.com',
    to: too,
    subject: 'Reset Passowrd',
    text: 'This mail sent through Node js code',
    html: `<p>Your OTP is <h1>${otpnumber}</h1>
    <b>Note:</b> Please donot reply this email</p>`,
    // html: `<p>Hi ${too},
    // Click <a href="http://localhost:3000/code-verification/code-verification1?token=${token}">here</a> to reset your password</p>

    // We received a request to access your User Account ${too} through your email address. Your Acco verification code is:

    // 904109

    // If you did not request this code, it is possible that someone else is trying to access the Google Account hmbharath88@gmail.com. Do not forward or give this code to anyone.

    // Sincerely yours,

    // The Google Accounts team</p><h1>${otpnumber}</h1>`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } else {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  });
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendResetPasswordEmailOTPLogin,
  DocumentSharingMail,
};
