import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";

function call(method, path) {
  const res = {
    writeHead(status) {
      this.status = status;
    },
    end(body) {
      this.body = JSON.parse(body);
    },
  };
  handle({ method, url: path }, res);
  return res;
}

test("GET /health は 200 で { status: \"ok\" } を返す", () => {
  const r = call("GET", "/health");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { status: "ok" });
});

test("知らない path は 404", () => {
  assert.equal(call("GET", "/nope").status, 404);
});
