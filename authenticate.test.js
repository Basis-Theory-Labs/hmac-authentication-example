const authenticate = require('./authenticate');

describe('authenticate', () => {
  test('should add Authentication header', async () => {
    const { headers } = await authenticate({
      args: {
        headers: {
          // making sure headers casing doesn't matter
          'x-DaTe': '2024-10-30T20:05:21.188Z',
          'X-lOgIn': '0123456789',
        },
        body: {
          foo: 'bar',
        },
      },
      configuration: {
        DLOCAL_SECRET_KEY: 'ABCDEFG123456789',
      },
    });
    expect(headers.Authorization).toStrictEqual(
      'V2-HMAC-SHA256, Signature: b809e7e2e21f895863997bb2bb3751f02906aceac4fdc6789c29646b7aff9a85'
    );
  });
});
