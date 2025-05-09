const forge = require("node-forge");
const authenticate = require("./authenticate");

describe("authenticate", () => {
  test("Should add signature parameter", async () => {
    const { body } = await authenticate({
      args: {
        headers: {},
        body: "foo=bar&bankID=9876545"
      },
      configuration: {
        SIGNATURE_KEY: "abc123",
      },
    });
    expect(body).toContain("signature=11582e4849c86cebba7a6b080a9c05e3f20ea8911a91f41549dd3740b3c211ec8e71460943f400a0191a4c7bfbfecb28ec5a203b67b218ba923ee5e920ef946e")
  });
});
