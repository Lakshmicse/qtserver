const _ = require('lodash');
const { MongoClient, ObjectId } = require('mongodb');

// const catchAsync = require('../utils/catchAsync');
const { companyService } = require('./index');
const config = require('../config/config');

const getFormFields = async (customization, formCategory) => {
  // eslint-disable-next-line no-console
  const Form = customization[formCategory];
  const category = _.keys(Form);

  const inputFields = category.map((itemIndex) => {
    // i.e Persional Info, Bank Detais
    const subSection = Form[itemIndex].predefinedFields.concat(Form[itemIndex].additionalFields);
    const inputList = subSection.map((pfield, sindex) => {
      const input = subSection[sindex];
      input.category = itemIndex; // Tag input to categoery i.e Persional Info, Bank Detais
      return input;
    });
    return inputList;
  });

  const flat = inputFields.flat();
  return flat;
};
const getFormFieldsBulkImport = async (customization, formCategory, companyId) => {
  // eslint-disable-next-line no-console
  const Form = customization[formCategory];
  const category = _.keys(Form);
  const FormFields = {};
  let fieldname;
  // eslint-disable-next-line no-unused-vars
  const inputFields = category.map((itemIndex) => {
    // i.e Persional Info, Bank Detais
    FormFields[itemIndex] = { status: 'HR_DRAFT' };
    const subSection = Form[itemIndex].predefinedFields.concat(Form[itemIndex].additionalFields);
    const inputList = subSection.map((pfield, sindex) => {
      const input = subSection[sindex];
      fieldname = pfield.name;
      FormFields[itemIndex][fieldname] = '';
      input.category = itemIndex; // Tag input to categoery i.e Persional Info, Bank Detais
      return input;
    });
    return inputList;
  });
  FormFields.WorkflowStatus = 'HR_DRAFT';
  FormFields.CompanyId = companyId;
  // const flat = inputFields.flat();
  return FormFields;
};

const getValidationSchema = async (formFieds) => {
  const schema = {
    // $async: true,
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
  };

  const properties = {};
  const required = [];

  formFieds.forEach((input) => {
    // const k = input;
    if (input.mandatory === true && input.isChecked === true) {
      required.push(input.name);
    }
    if (input.dataType === 'string') {
      properties[input.name] = { type: 'string' };
    }
    if (input.dataType === 'number') {
      properties[input.name] = { type: 'number' };
    }
  });

  const v = { ...schema, required, properties };
  return v;
}; // End of get validation
const getFormDetailForCompany = async (companyId, formCategory) => {
  // eslint-disable-next-line no-console
  const company = await companyService.getCompanyById(companyId);
  // const schemaValidator = new SchemaValidator({ allErrors: true });

  // eslint-disable-next-line no-console
  const formFields = await getFormFields(company.customization, formCategory);
  // const vaidationSchema = getValidationSchema(formFields);
  return formFields;
};
/**
 * Get Form Columns
 * @param {string} companyId
 * @returns {Promise<User>}
 */
const getFormColumnNames = async (companyId, formName) => {
  // eslint-disable-next-line no-param-reassign

  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(config.mongoose.database);
  const dCollection = db.collection('companies');
  // eslint-disable-next-line no-console

  const result = await dCollection.findOne({ _id: ObjectId(companyId) });
  const formCustomization = result.customization[formName];
  // eslint-disable-next-line no-console
  const tabs = Object.keys(formCustomization);

  const columns = [];

  tabs.forEach((col) => {
    const section = formCustomization[col];
    // eslint-disable-next-line no-console
    try {
      section.predefinedFields.forEach((ele) => {
        columns.push(ele.name);
      });
      section.additionalFields.forEach((ele) => {
        columns.push(ele.name);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  return columns;
};
const getFormColumnElements = async (companyId, formName) => {
  // eslint-disable-next-line no-param-reassign

  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(config.mongoose.database);
  const dCollection = db.collection('companies');
  // eslint-disable-next-line no-console

  const result = await dCollection.findOne({ _id: ObjectId(companyId) });
  const formCustomization = result.customization[formName];
  // eslint-disable-next-line no-console
  const tabs = Object.keys(formCustomization);

  const columns = [];

  tabs.forEach((col) => {
    const section = formCustomization[col];
    // eslint-disable-next-line no-console
    try {
      section.predefinedFields.forEach((ele) => {
        columns.push(ele);
      });
      section.additionalFields.forEach((ele) => {
        columns.push(ele);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  return columns;
};
const getFormColumnElementsForDownloadcenter = async (companyId, formName) => {
  // eslint-disable-next-line no-param-reassign

  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(config.mongoose.database);
  const dCollection = db.collection('companies');
  // eslint-disable-next-line no-console

  const result = await dCollection.findOne({ _id: ObjectId(companyId) });
  const formCustomization = result.customization[formName];
  // eslint-disable-next-line no-console
  const tabs = Object.keys(formCustomization);

  const columns = [];

  tabs.forEach((col) => {
    const section = formCustomization[col];
    // eslint-disable-next-line no-console
    try {
      section.predefinedFields.forEach((ele) => {
        if (ele.isChecked === true) {
          columns.push(ele.name);
        }
      });
      section.additionalFields.forEach((ele) => {
        if (ele.isChecked === true) {
          columns.push(ele.name);
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  return columns;
};

/**
 * Get Form Columns
 * @param {string} companyId
 * @returns {Promise<User>}
 */
const getFormGreytipMapping = async (companyId, formName) => {
  // eslint-disable-next-line no-param-reassign

  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(config.mongoose.database);
  const dCollection = db.collection('companies');
  // eslint-disable-next-line no-console

  const result = await dCollection.findOne({ _id: ObjectId(companyId) });
  const formCustomization = result.customization[formName];
  // eslint-disable-next-line no-console
  const tabs = Object.keys(formCustomization);

  const columns = [];
  const mapping = {};

  tabs.forEach((col) => {
    const section = formCustomization[col];
    // eslint-disable-next-line no-console
    try {
      section.predefinedFields.forEach((ele) => {
        columns.push(ele.name);
        mapping[ele.name] = ele.greytipMapping;
      });
      section.additionalFields.forEach((ele) => {
        columns.push(ele.name);
        mapping[ele.name] = ele.greytipMapping;
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  return mapping;
};
const getEmployeeById = async (id, dbURI, collectionName) => {
  let client;
  let db;
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const dCollection = db.collection(collectionName);
    // eslint-disable-next-line no-console

    const result = await dCollection.findOne({ _id: ObjectId(id) });
    // let result = await dCollection.countDocuments();
    // your other codes ....
    // eslint-disable-next-line no-console

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

module.exports = {
  getFormFields,
  getFormDetailForCompany,
  getValidationSchema,
  getFormColumnNames,
  getFormGreytipMapping,
  getFormColumnElements,
  getEmployeeById,
  getFormFieldsBulkImport,
  getFormColumnElementsForDownloadcenter,
};
