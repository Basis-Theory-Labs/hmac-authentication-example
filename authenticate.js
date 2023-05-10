const forge = require("node-forge");

const authorizationScheme = "V1-HMAC-SHA256";

function computeHash(message, base64key) {
  const key = forge.util.decode64(base64key);
  const hmac = forge.hmac.create();
  hmac.start("sha256", key);
  hmac.update(message);
  return forge.util.encode64(hmac.digest().bytes());
}

const createAuthHeader = (publicKey, date, privateKey, bodyJ) => {
  const payloadToSign = publicKey + date + bodyJ;
  const computedSignature = computeHash(payloadToSign, privateKey);
  return `${authorizationScheme}, Signature: ${computedSignature}`;
};

const createAuthenticationHeaders = ({ jsonBody, publicKey, privateKey }) => {
  const date = new Date().toISOString();
  const authHeader = createAuthHeader(publicKey, date, privateKey, jsonBody);
  return {
    "X-Client-Key": publicKey,
    "X-Date": date,
    Authorization: authHeader,
  };
};

module.exports = async (req) => {
  const { args, configuration } = req;
  const { body, headers, method, path, query } = args;
  const { DESTINATION_PUBLIC_KEY, DESTINATION_PRIVATE_KEY } = configuration;

  const jsonBody = JSON.stringify(body);

  const authenticationHeaders = createAuthenticationHeaders({
    jsonBody,
    publicKey: DESTINATION_PUBLIC_KEY,
    privateKey: DESTINATION_PRIVATE_KEY,
  });

  return {
    body,
    headers: {
      ...headers,
      ...authenticationHeaders,
    },
  };
};
