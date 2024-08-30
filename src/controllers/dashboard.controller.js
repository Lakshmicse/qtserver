/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');


const {
  Client
} = require("@microsoft/microsoft-graph-client");
const {
  TokenCredentialAuthenticationProvider
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {
  DeviceCodeCredential
} = require("@azure/identity");

const catchAsync = require('../utils/catchAsync');
const { dashboardService } = require('../services');
const pick = require('../utils/pick');

const getAll = catchAsync(async (req, res) => {
  // const data = { f : 10}

  const l = await dashboardService.queryDashboard(req.tenant.dbURI, req);

  res.status(httpStatus.CREATED).send({ user : "dfffd", status : l});
});
const getApprove = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status', 'month', 'year']);
  const l = await dashboardService.approvalpending(req.tenant.dbURI, req, filter);

  res.status(httpStatus.CREATED).send({ user : "dfffd", status : l});
});

const oneDrive = catchAsync(async () => {
  // eslint-disable-next-line no-console
  const credential = new DeviceCodeCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: [scopes]
});

// eslint-disable-next-line no-unused-vars
const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider
    // Use the authProvider object to create the class.
});
})
const getAllSuper = catchAsync(async (req, res) => {
  // const data = { f : 10}

  const l = await dashboardService.querysuperAdminDashboard();

  res.status(httpStatus.CREATED).send({ user : "dfffd", status : l});
});

module.exports = {
  getAll,
  getAllSuper,
  oneDrive,
  getApprove,
};
