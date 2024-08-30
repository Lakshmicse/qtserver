const Joi = require('joi');

// ...

const personID = Joi.string().guid({ version: 'uuidv4' });

const name = Joi.string()
  .regex(/^[A-Z]+$/)
  .uppercase();

const ageSchema = Joi.alternatives().try([
  Joi.number().integer().greater(6).required(),
  Joi.string()
    .replace(/^([7-9]|[1-9]\d+)(y|yr|yrs)?$/i, '$1')
    .required(),
]);

const personDataSchema = Joi.object()
  .keys({
    id: personID.required(),
    firstname: name,
    lastname: name,
    fullname: Joi.string()
      .regex(/^[A-Z]+ [A-Z]+$/i)
      .uppercase(),
    type: Joi.string().valid('STUDENT', 'TEACHER').uppercase().required(),

    age: Joi.when('type', {
      is: 'STUDENT',
      then: ageSchema.required(),
      otherwise: ageSchema,
    }),
  })
  .xor('firstname', 'fullname')
  .and('firstname', 'lastname')
  .without('fullname', ['firstname', 'lastname']);

// ...

// export the schemas
module.exports = {
  '/people': personDataSchema,
  // 'LopDays' : lopDayschema
  // '/auth/edit': authDataSchema,
  // '/fees/pay': feesDataSchema
};
