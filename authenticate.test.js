const authenticate = require('./authenticate');

describe('authenticate', () => {
  test('should add Authentication header', async () => {
    const { headers } = await authenticate({
      args: {
        headers: {},
        body: {
          foo: 'bar',
        },
      },
      configuration: {
        DLOCAL_SECRET_KEY: '2P6GBSQ8ZTZLP3MZ98SZ',
      },
    });
    expect(headers.Authorization).toMatch(
      /^V2-HMAC-SHA256, Signature:\s[a-z0-9]{64}$/gu
    );
  });
});
