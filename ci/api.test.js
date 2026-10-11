// CI だけで走る API の回帰試験（Worker の Agent からは見えない。Harness が走らせる）。
// 通信はせず、HTTP の handler を直接呼ぶ（隔離の中では localhost の任意の port に接続できないため）。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";

function get(path) {
  return new Promise((resolve) => {
    const res = {
      status: 0,
      writeHead(status) {
        this.status = status;
        return this;
      },
      end(body) {
        resolve({ status: this.status, body: JSON.parse(body) });
      },
    };
    handle({ method: "GET", url: path }, res);
  });
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
