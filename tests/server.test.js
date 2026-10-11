import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";

function call(method, url) {
  const out = {};
  const res = {
    writeHead(status, headers) {
      out.status = status;
      out.headers = headers;
    },
    end(body) {
      out.body = body;
    },
  };
  handle({ method, url }, res);
  return out;
}

test("GET /health は 200 で { status: \"ok\" } を返す", () => {
  const r = call("GET", "/health");
  assert.equal(r.status, 200);
  assert.deepEqual(JSON.parse(r.body), { status: "ok" });
});

test("未定義のパスは 404", () => {
  assert.equal(call("GET", "/nope").status, 404);
});
