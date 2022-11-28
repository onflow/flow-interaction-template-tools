import { expect, test } from "@oclif/test";

describe("generate", () => {
  test
    .stdout()
    .command(["generate", "./test.cdc"])
    .it("test", (ctx) => {
      expect(true).to.equal(true);
    });
});
