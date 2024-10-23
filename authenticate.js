const crypto = require('crypto');
const {
  CustomHttpResponseError,
} = require('@basis-theory/basis-theory-reactor-formulas-sdk-js');
const stringify = require('json-stable-stringify');

const authorizationScheme = 'V2-HMAC-SHA256';

function calculateSignature(xLogin, date, secretKey, jsonBody) {
  let message = xLogin + date;
  if (jsonBody) {
    message += jsonBody;
  }

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message, 'utf-8');
  const signature = hmac.digest('hex');

  return `${authorizationScheme}, Signature: ${signature}`;
}

module.exports = async (req) => {
  try {
    const { args, configuration } = req;
    const { body, headers: _headers } = args;

    // make headers lowercase to ease the access
    const headers = Object.entries(_headers).reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key.toLowerCase()]: value,
      }),
      {}
    );

    const xLogin = headers['x-login'];
    const date = headers['x-date'];
    const secretKey = configuration.DLOCAL_SECRET_KEY;

    const jsonBody = body && stringify(body);

    const signature = calculateSignature(xLogin, date, secretKey, jsonBody);

    return {
      body: jsonBody,
      headers: {
        ..._headers,
        Authorization: signature,
      },
    };
  } catch (error) {
    throw new CustomHttpResponseError({
      status: 500,
      body: {
        proxy_request_transform_error: {
          name: error.name,
          message: error.message,
          status: error.status,
          data: error.data,
          stack: error.stack,
        },
      },
    });
  }
};
