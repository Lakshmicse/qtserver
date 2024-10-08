const passport = require('passport');
const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { Tenant } = require('../models');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
 
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  
  req.user = user;
  let tenant;
  if (user.role === 'payrolladmin' || user.role === 'payrollreviewer') {
    tenant = await Tenant.findOne({ ClientId: new ObjectId(req.query.tenantId) });
  } else {
    tenant = await Tenant.findOne({ ClientId: new ObjectId(user._doc.companyId) });
  }
  global.globalString = 'This can be accessed anywhere!';

  req.tenant = tenant;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
   
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
