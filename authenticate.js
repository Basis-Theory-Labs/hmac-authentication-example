const forge = require("node-forge");
const crypto = require("crypto");
const querystring = require("querystring");

const authorizationScheme = "V1-HMAC-SHA512";

function computeHash(message, base64key) {
  const key = forge.util.decode64(base64key);
  const hmac = forge.hmac.create();
  hmac.start("sha512", key);
  hmac.update(message);
  return forge.util.encode64(hmac.digest().bytes());
}

function urlencode(str) {
  str = String(str);
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E")
    .replace(/%20/g, "+");
}

function sha512(str) {
  return crypto.createHash("sha512").update(str).digest("hex");
}

module.exports = async (req) => {
  const { args, configuration } = req;
  const { body, headers, method, path, query } = args;
  const { SIGNATURE_KEY} = configuration;

  const jsonBody = querystring.parse(body);
  const objectMatrix = Object.entries(jsonBody).sort((A,B)=> A[0].localeCompare(B[0]));
  const sortedBody = Object.fromEntries(objectMatrix);
  const sortedBodyString = querystring.encode(sortedBody);
  const signature = sha512(sortedBodyString + SIGNATURE_KEY);

  sortedBody.signature = signature;

  const encodedSignedBody = querystring.encode(sortedBody);



  return {
    body : encodedSignedBody,
    headers 
  };
};
