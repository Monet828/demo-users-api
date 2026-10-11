// CI だけで走る、公開の前提の試験：死活監視の endpoint（Worker の Agent からは見えない。Harness が走らせる）。
// 通信はせず、HTTP の handler を直接呼ぶ。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";

function get(path) {
  return new Promise((resolve) => {
    const res = {
      status: 0,
      headers: {},
      writeHead(status, headers = {}) {
        this.status = status;
        this.headers = headers;
        return this;
      },
      end(body) {
        resolve({ status: this.status, headers: this.headers, body: JSON.parse(body) });
      },
    };
    handle({ method: "GET", url: path }, res);
  });
}

test("GET /health は 200 で { status: \"ok\" } を返す（死活監視）", async () => {
  const r = await get("/health");
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "ok");
});

test("知らない path は 404 のまま", async () => {
  const r = await get("/nope");
  assert.equal(r.status, 404);
});
