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

test("size が 100 を超えると 400 と invalid_query を返す", () => {
  for (const size of [101, 999]) {
    const res = call("GET", `/api/users?size=${size}`);
    assert.equal(res.status, 400);
    assert.deepEqual(JSON.parse(res.body), { error: "invalid_query" });
  }
});

test("size が 100 ちょうどなら 200 を返す", () => {
  assert.equal(call("GET", "/api/users?size=100").status, 200);
});
