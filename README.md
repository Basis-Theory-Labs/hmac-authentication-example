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
    ingo_username = "merchant1"
    ingo_secret     = "12345678910abcdefg"   
    ```

3. Initialize Terraform:

    ```shell
    terraform init
    ```

4. Run Terraform to provision all the required resources:

    ```shell
    terraform apply
    ```

Using the outputs from Terraform, you can make a request to IngoPayments to [verify a card](https://developer-payments.ingomoney.com/en/ingopay-api/gateway/verify) using an existing token (e.g., `dca501d0-993d-4e8f-a6aa-219e3a531746`):

```curl
curl -L 'https://api.basistheory.com/proxy/gateway/verify' \
-H 'BT-PROXY-KEY: {ingo_proxy_key}' \
-H 'Content-Type: application/json' \
-H 'BT-API-KEY: {backend_application_key}' \
-d '{
  "participant_id": 00000,
  "account_type": "CA",
  "recipient_first_name": "Tom",
  "recipient_last_name": "Smith",
  "account": "{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: \"$.data.number\" }}",
  "expiration_date": "{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: \"$.data\" | card_exp: \"YYMM\" }}",
  "cvv": "{{ token: dca501d0-993d-4e8f-a6aa-219e3a531746 | json: \"$.data.cvc\" }}",
  "recipient_address1": "123 Main St.",
  "recipient_city": "Smallville",
  "recipient_state": "TX",
  "recipient_zip": "93245",
  "recipient_phone": "8015555555",
  "participant_unique_id1": "0001",
  "timestamp": 1579291169,
  "version": "11"
}'
```

> ⚠️ Make sure to replace the keys above with the appropriated values.
