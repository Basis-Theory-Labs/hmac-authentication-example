const authenticate = require('./authenticate');

describe('authenticate', () => {
  test('should add Authentication header', async () => {
    const { headers } = await authenticate({
      args: {
        headers: {
          'X-Date': 'Wed, 27 Nov 2024 17:18:20 GMT',
          'Content-Length': '123',
          'Content-Type': 'application/json',
          'BT-TRACE-ID': 'asd123',
        },
        body: {
          foo: 'bar',
        },
      },
      configuration: {
        INGO_USERNAME: 'BasisTheory',
        INGO_SECRET: 'ABCDEFG123456789',
      },
    });
    expect(headers.Authorization).toStrictEqual(
      `hmac username="BasisTheory", algorithm="hmac-sha512", headers="request-line x-date content-sha512 content-length content-type BT-TRACE-ID Accept User-Agent Cache-Control", signature="N160AFUQsotsE1bu7o1j/jl5Km9bAsrWJ/OtWkciNStRkQ4fWON62lRV4ozaKzitVSS0cT6bBzjDYoed2ljqmw=="`
    );
  });
});
