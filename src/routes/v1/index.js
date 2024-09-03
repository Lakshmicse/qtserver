/* eslint-disable no-unused-vars */
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const docsRoute = require('./docs.route');
const companyRoute = require('./company.route');

const vehicleRoute = require('./vehicle.route');
const driverRoute = require('./driver.route');
const customersRoute = require("./customersroute")
const rejectJobRoute = require('./rejected-job-log.route');
const dispatcherRoute = require('./dispatcher.route');
const callRoute = require('./call.route');

const cartRoute = require('./cart.route');

const customizationRoute = require('./customization.route');



const productRoute = require('./product.route');
const productVariantRoute = require('./productVariant.route');

const orderRoute = require('./order.route');

const orderItemRoute = require('./orderItem.route');

const addressRoute = require('./address.route');

const categoryRoute = require('./category.route');

const brandRoute = require('./brand.route');

const filesend = require('./filesend.route');
const config = require('../../config/config');
const contactUs = require('./contactUs.route');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/filesend',
    route: filesend,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/productVariant',
    route: productVariantRoute,
  },
  {
    path: '/customization',
    route: customizationRoute,
  },

  
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/call',
    route: callRoute,
  },
  {
    path: '/contact-us',
    route: contactUs,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/company',
    route: companyRoute,
  },

  {
    path: '/vehicle',
    route: vehicleRoute,
  },
  {
    path: '/driver',
    route: driverRoute,
  },
  {
    path: '/customer',
    route:customersRoute,
  },
  {
    path: '/dispatcher',
    route: dispatcherRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
 
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/order-item',
    route: orderItemRoute,
  },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/brand',
    route: brandRoute,
  },
  {
    path: '/rejected-job',
    route: rejectJobRoute,
  },
];
const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
