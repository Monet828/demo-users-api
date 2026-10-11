import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";

function call(method, path) {
  const res = {
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };
  handle({ method, url: path }, res);
  return res;
}

test("GET /health は 200 と { status: ok } を返す", () => {
  const res = call("GET", "/health");
  assert.equal(res.status, 200);
  assert.match(res.headers["content-type"], /application\/json/);
  assert.deepEqual(JSON.parse(res.body), { status: "ok" });
});

test("POST /health は 404 を返す", () => {
  assert.equal(call("POST", "/health").status, 404);
});
