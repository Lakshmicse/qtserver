/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendmailforAction } = require('../services');

const getTemplateBySearch = catchAsync(async (req, res) => {
  const resignation = await sendmailforAction.gettemplateBySearch(req.body.eventName, req.body.Role, req.body.To);
  if (!resignation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resignation not found ');
  }
  res.send(resignation);
});
const getmailid = async (companyid, role) => {
  const maildetails = await sendmailforAction.getuseremail(companyid, role );
  if (!maildetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not found ');
  }
  return maildetails;
};
const getUserByCompanyID = catchAsync(async (req, res) => {
  const {companyId} = req.params;
    const users = await sendmailforAction.getuserByCompanyID(companyId);
    // // eslint-disable-next-line no-console
    // eslint-disable-next-line no-unused-vars
    const template = await sendmailforAction.gettemplateBySearch(req.body.eventName, req.user.role);
    let to;
    const cc = [];
    if( req.user.role === 'payrolladmin') {
      // eslint-disable-next-line no-unused-vars
      const rolescompany = [];
      users.forEach((val) => {
          rolescompany.push(val.role);
      });
      if( rolescompany.includes('hrprocessor') && rolescompany.includes('hradmin') && rolescompany.includes('hrprocessor')) {
        to = await getmailid(companyId, 'hrprocessor');
        const cc1 = await getmailid(companyId, 'hradmin');
        const cc2 = await getmailid(companyId, 'hrapprover');
        cc.push(cc1.email);
        cc.push(cc2.email);
      } else if(rolescompany.includes('hrprocessor') && rolescompany.includes('hrprocessor') && !rolescompany.includes('hradmin')) {
        to = await getmailid(companyId, 'hrprocessor');
        const cc3 = await getmailid(companyId, 'hrapprover');
        cc.push(cc3.email);
      } else if(rolescompany.includes('hradmin') && !rolescompany.includes('hrprocessor') && !rolescompany.includes('hrprocessor')) {
        to = await getmailid(companyId, 'hradmin');
      }
    } else {
      to = await getmailid(companyId, template.to); 
      if (template.cc !== ''){
       const cc4 = await getmailid(companyId, template.cc);
       cc.push(cc4.email);
      }
      
    }
    if (cc.length !== 0){
      const sendmailwithcc = await sendmailforAction.sendResetPasswordEmail(template.subject, to.name, to.email, cc, req.body.formName, [req.body.employeeNumber], template['Action Done'], req.user.name, template['Request Action']);

    } else {
      const sendmailwithoutcc = await sendmailforAction.sendResetPasswordEmail(template.subject, to.name, to.email, cc, req.body.formName, [req.body.employeeNumber], template['Action Done'], req.user.name, template['Request Action']);

    }
	// eslint-disable-next-line no-console
	console.log('template',template.subject, to.name, to.email, cc, req.body.formName, [req.body.employeeNumber], template['Action Done'], req.user.name, template['Request Action']);
    if (!users) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Resignation not found ');
    }
    res.send(users);
  });
module.exports = {
    getTemplateBySearch,
    getUserByCompanyID,
};
