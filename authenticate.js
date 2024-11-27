const crypto = require('crypto');
const {
  CustomHttpResponseError,
} = require('@basis-theory/basis-theory-reactor-formulas-sdk-js');
const stringify = require('json-stable-stringify');

module.exports = async (req) => {
  try {
    const { args, configuration } = req;
    const { body, headers: _headers, method, path, query } = args;

    const jsonBody = body && stringify(body);

    const date = new Date().toUTCString();

    const contentSha512 = crypto
      .createHash('sha512')
      .update(jsonBody)
      .digest('base64');

    // create an explicit headers object
    // containing only whitelisted headers
    // (the ones we know won't break authentication)
    const headers = {
      // Ingo required headers
      'x-date': _headers['X-Date'] || date,
      'content-sha512': contentSha512,
      'content-length': _headers['Content-Length'],
      'content-type': _headers['Content-Type'],

      // BT important header
      'BT-TRACE-ID': _headers['BT-TRACE-ID'],

      // OK Client headers
      Accept: _headers['Accept'],
      'User-Agent': _headers['User-Agent'],
      'Cache-Control': _headers['Cache-Control'],

      // these headers break the authentication - ingo doesn't like them
      // 'X-Amzn-Trace-Id': _headers['X-Amz-Trace-Id'],
      // 'Accept-Encoding': _headers['Accept-Encoding'],
    };

    // can't use all the headers from the client request
    // const headers = Object.entries(_headers).reduce(
    //   (obj, [key, value]) => ({
    //     ...obj,
    //     [key.toLowerCase()]: value,
    //   }),
    //   {
    //     'content-sha512': contentSha512,
    //     'x-date': date,
    //   }
    // );

    const requestLine = `${method} ${path} HTTP/1.1`;

    const signatureString = Object.entries(headers).reduce(
      (previous, [key, value]) => `${previous}\n${key}: ${value}`,
      requestLine
    );

    const headersString = Object.keys(headers).reduce(
      (previous, key) => `${previous} ${key}`,
      'request-line'
    );

    const signature = crypto
      .createHmac('sha512', configuration.INGO_SECRET)
      .update(signatureString)
      .digest('base64');

    const authorization = `hmac username="${configuration.INGO_USERNAME}", algorithm="hmac-sha512", headers="${headersString}", signature="${signature}"`;

    // console.log(headers);
    // console.log(_headers);
    // console.log(authorization);

    return {
      body: jsonBody,
      headers: {
        ...headers,
        Authorization: authorization,
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
