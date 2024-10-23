# HMAC Authentication Example

HMAC-based API authentication is a method of securing APIs by using a combination of a secret key and a cryptographic hash function known as HMAC (Hash-based Message Authentication Code). 

The parameters used for calculating the HMAC signature typically include the request payload, a timestamp and the public key (or key identifier), but they can vary depending on the API specification, which may include additional parameters, such as the HTTP method, path or a nonce.

This repository shows how to generate an HMAC signature to authenticate proxied requests against an API endpoint, by running custom code in a Proxy [Request Transform](https://developers.basistheory.com/docs/api/proxies/pre-configured-proxies#request-transforms).

## Run this Example

Follow the steps below to create a new Proxy:


1. [Create a new Management Application](https://portal.basistheory.com/applications/create?name=Terraform&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&permissions=proxy%3Acreate&permissions=proxy%3Aread&permissions=proxy%3Aupdate&permissions=proxy%3Adelete&type=management) with full `application` and `proxy` permissions.

2. Paste the API key to a new `terraform.tfvars` file at this repository root:

    ```terraform
    # Basis Theory Management Application Key
    bt_management_api_key = "key_W8wA8CmcbwXxJsomxeWHVy"
    # Destination API key
    dlocal_secret_key     = "12345678910abcdefg"   
    ```

3. Initialize Terraform:

    ```shell
    terraform init
    ```

4. Run Terraform to provision all the required resources:

    ```shell
    terraform apply
    ```

Using the outputs from Terraform, you can make a request to dLocal to [save a card](https://docs.dlocal.com/reference/create-a-card):

```curl
curl -L 'https://api.basistheory.com/proxy/secure_cards' \
-H 'X-Login: 123456789' \
-H 'X-Trans-Key: 123456789a' \
-H 'X-Version: 2.1' \
-H 'X-Date: 2024-10-22T20:08:49.744Z' \
-H 'BT-PROXY-KEY: {dlocal_proxy_key}' \
-H 'Content-Type: application/json' \
-H 'BT-API-KEY: {backend_application_key}' \
-d '{
   "card": {
     "cvv":"{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: '\''$.data.cvc'\'' }}",
     "expiration_month":"{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746| json: '\''$.data.expiration_month'\'' }}",
     "expiration_year":"{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: '\''$.data.expiration_year'\'' }}",
     "holder_name": "John Doe",
     "number":"{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: '\''$.data.number'\'' }}"
   },
   "country": "US",
   "payer": {
     "document": "1234567890",
     "email": "john.doe@email.com",
     "name": "John Doe"
   }
}'
```

> ⚠️ Make sure to replace the keys above with the appropriated values.
