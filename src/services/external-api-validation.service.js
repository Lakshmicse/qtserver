const axios = require('axios');
const config = require('../config/config');

const panValidator = async (pan) => {
  const configPan = {
    headers: {
      Authorization: config.externalApiToken,
    },
  };
  try {
    const { data } = await axios.post(
      'https://kyc-api.aadhaarkyc.io/api/v1/pan/pan',
      {
        id_number: pan,
      },
      configPan
    );
    return data;
  } catch (err) {
    return false;
  }
};
const gstnValidator = async (gstin) => {
  const configGstin = {
    headers: {
      Authorization: config.gstnRequestToken,
      'x-api-key': config.xApiKeyGstn,
      'x-api-version': '3.4',
    },
  };
  try {
    const { data } = await axios.post(
      `https://api.sandbox.co.in/authorize?request_token=${config.gstnRequestToken}`,
      {},
      configGstin
    );
    const configGstin2 = {
      headers: {
        Authorization: data.access_token,
        'x-api-key': config.xApiKeyGstn,
      },
    };
    const { data: gstnData } = await axios.get(`https://api.sandbox.co.in/gsp/public/gstin/${gstin}`, configGstin2);
    return gstnData;
  } catch (err) {
    return false;
  }
};

//  eslint-disable-next-line
const aadhaarValidator = async (aadhaar) => {
  const configAadhaar = {
    headers: {
      Authorization: config.externalApiToken,
    },
  };
  try {
    const { data } = await axios.post(
      'https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-validation/aadhaar-validation',
      {
        id_number: aadhaar,
      },
      configAadhaar
    );
    return data;
  } catch (error) {
    // errorRef.current['Aadhaar Number'] = { __errors: [error.response.data.message || ''] };
    return false;
  }
};

//  eslint-disable-next-line
const bankValidator = async (bankNumber, ifsc) => {
  const configBank = {
    headers: {
      Authorization: config.externalApiToken,
    },
  };
  try {
    const { data } = await axios.post(
      'https://kyc-api.aadhaarkyc.io/api/v1/bank-verification/',
      {
        id_number: bankNumber,
        ifsc,
      },
      configBank
    );

    //  eslint-disable-next-line
      return data;
  } catch (error) {
    // errorRef.current['Bank Account Number'] = { __errors: [error.response.data.message || ''] };
    return error;
  }
};

module.exports = { panValidator, gstnValidator, bankValidator, aadhaarValidator };
