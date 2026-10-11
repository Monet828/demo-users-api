// CI だけで走る API の回帰試験（Worker の Agent からは見えない。Harness が走らせる）。
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { handle } from "../src/server.js";

async function get(path) {
  const server = http.createServer(handle);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
    return { status: res.status, body: await res.json() };
  } finally {
    server.close();
  }
}

test("一致する利用者がいなくても 200 で空の一覧を返す", async () => {
  const r = await get("/api/users?role=guest");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { users: [], total: 0, page: 1, lastActive: null });
});

test("チームに属していない利用者も 200 で返し、team は null", async () => {
  const r = await get("/api/users?role=contractor");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.users, [{ id: 4, name: "田中 健", role: "contractor", team: null }]);
});

test("全員の一覧も 200", async () => {
  const r = await get("/api/users");
  assert.equal(r.status, 200);
  assert.equal(r.body.total, 4);
});
