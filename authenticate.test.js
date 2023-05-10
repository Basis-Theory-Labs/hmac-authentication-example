const forge = require("node-forge");
const authenticate = require("./authenticate");

describe("authenticate", () => {
  test("should add authentication headers", async () => {
    const { headers } = await authenticate({
      args: {
        headers: {},
        body: {
          foo: "bar",
        },
      },
      configuration: {
        DESTINATION_PUBLIC_KEY: "2P6GBSQ8ZTZLP3MZ98SZ",
        DESTINATION_PRIVATE_KEY: "aGMarItuqNYd7P+F232oLvfYHnTObbun91Y0l6/aZ28=",
      },
    });

    expect(headers).toHaveProperty("X-Client-Key", "2P6GBSQ8ZTZLP3MZ98SZ");
    expect(headers).toHaveProperty("X-Date");
    expect(headers).toHaveProperty("Authorization");
  });
});
