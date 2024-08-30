/* eslint-disable prettier/prettier */
const nodemailer = require('nodemailer');

const httpStatus = require('http-status');
const { User, SendMail } = require('../models');
const ApiError = require('../utils/ApiError');
// const config = require('../config/config');
// const logger = require('../config/logger');

const sendResetPasswordEmail = async (Subject, receivername,receivermailaddress,ccaddress, formname, employeenumbers, actionDone, regardsname, requestAction) => {

  const mailTransporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //     // user: 'hmbharath88@gmail.com',
    //     // pass: 'flns hyig zxtz jhxn'
    //     user: 'bharath@neelitech.com',
    //     pass: 'xali uzir ihys tzwn'

    // }
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
    to: receivermailaddress,
    cc: ccaddress,
    subject: Subject,
    text: 'This mail sent through NOde js code',
    html: `<p>Dear ${receivername}, 
    <br> ${formname} form has been ${actionDone} <br> 
    <h2>Employee Number: ${employeenumbers}</h2><br>
    ${actionDone} by ${regardsname},<br>
    Request for Action:<br>
      Please Review and ${requestAction}.<br>
    Regards,<br>
    ${regardsname}<br>
    Click <a href="https://payroll.pierianservices.com/login">here</a> to navigate to the Application</p>
    <b>Note:</b> Please donot reply this email, It is an Computer Generated email`,
    
};

mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        // eslint-disable-next-line no-console
        console.log(err);
    } else {
        // eslint-disable-next-line no-console
        console.log(data);
    }
});
};
const gettemplateBySearch = async (eventName, Role) => {
    const templatesearch = await SendMail.findOne({
      $and: [{ eventname: eventName }, { role: Role }],
    });
    if (!templatesearch) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Repayments not found');
    }
    return templatesearch;
  };
const getuserByCompanyID = async (key) => {
  const usersearch = await User.find({companyId:key});
  if (!usersearch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Repayments not found');
  }
  return usersearch;
};
const getuseremail = async (companyid, Role) => {
  const usersearch = await User.findOne({$and: [{companyId:companyid},{role:Role}],});
  if (!usersearch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Repayments not found');
  }
  return usersearch;
};
module.exports = {
    gettemplateBySearch,
    getuserByCompanyID,
  sendResetPasswordEmail,
  getuseremail,
};