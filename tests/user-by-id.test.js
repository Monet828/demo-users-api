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

test("GET /api/users/1 は 200 と利用者を返す", () => {
  const res = call("GET", "/api/users/1");
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { id: 1, name: "佐藤 花子", role: "admin", team: "基盤" });
});

test("GET /api/users/9999 は 404 と { error: not_found } を返す", () => {
  const res = call("GET", "/api/users/9999");
  assert.equal(res.status, 404);
  assert.match(res.headers["content-type"], /application\/json/);
  assert.deepEqual(JSON.parse(res.body), { error: "not_found" });
});
