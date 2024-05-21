global.TextEncoder = require("node:util").TextEncoder; // Required for JSDOM to work with Node.js v16
global.TextDecoder = require("node:util").TextDecoder;
const { JSDOM } = require("jsdom");

it("should render a heading", () => {
    const dom = new JSDOM("<!DOCTYPE html><body></body>");
    global.document = dom.window.document;

    const _ = require("@/index.ts");

    expect(document.body.innerHTML).toBe("<h1>Hello World</h1>");
});
