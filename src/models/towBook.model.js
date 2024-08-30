const mongoose = require('mongoose');

const TowBookSchema = new mongoose.Schema({
  purchaseOrder: { type: String },
  callNumber: { type: String },
  invoiceNumber: { type: String },
  accountName: { type: String },
  vin: { type: String },
  received: { type: String },
  dispatched: { type: String },
  enRoute: { type: String },
  onScene: { type: String },
  towing: { type: String },
  destinationArrival: { type: String },
  completed: { type: String },
  dispToOnScene: { type: String },
  enrouteToOnScene: { type: String },
  onSceneTime: { type: String },
  enrouteToDestArrive: { type: String },
  destinationWaitTime: { type: String },
  enrouteToComplete: { type: String },
  eta: { type: String },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  
  impound: { type: String },
  released: { type: String },
  notes: { type: String },
  odometer: { type: String },
  priority: { type: String },
  reason: { type: String },
  status: { type: String },
  towSource: { type: String },
  towSourceZip: { type: String },
  towDestination: { type: String },
  towDestinationZip: { type: String },
  distance: { type: String },
  truck: { type: String },
  towingServicesSubTotal: { type: String },
  storageFeesSubTotal: { type: String },
  storageNotificationFeesSubTotal: { type: String },
  storageAdministrationFeesSubTotal: { type: String },
  recoverySubTotal: { type: String },
  partsSubTotal: { type: String },
  subTotal: { type: String },
  tax: { type: String },
  invoiceTotal: { type: String },
  balanceDue: { type: String },
  currentPaymentStatus: { type: String },
  paymentsApplied: { type: String },
  firstOveragePayment: { type: String },
  rateItemTotal: { type: String },
  isLocked: { type: String },
  isAudited: { type: String },

  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});


// add plugin that converts mongoose to json
TowBookSchema.plugin(toJSON);
TowBookSchema.plugin(paginate);

TowBookSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('TowBookReport', TowBookSchema);
