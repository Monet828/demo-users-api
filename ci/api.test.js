// CI だけで走る API の回帰試験（Worker の Agent からは見えない。Harness が走らせる）。
// 通信はせず、HTTP の handler と listUsers を直接呼ぶ（隔離の中では localhost の任意の port に接続できないため）。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/server.js";
import { listUsers } from "../src/users.js";
import { PRODUCTION_LIKE } from "./production-like.js";

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

test("本番に近いデータ：チームに属していない利用者は team が null", () => {
  const r = listUsers({ role: "member" }, PRODUCTION_LIKE);
  assert.deepEqual(
    r.users.map((u) => [u.id, u.team]),
    [[2, "決済"], [4, null], [6, "検索"]],
  );
});

test("本番に近いデータ：一度も使っていない利用者は lastActive の計算に入れない", () => {
  assert.equal(listUsers({ role: "member" }, PRODUCTION_LIKE).lastActive, "2026-10-10T18:40:00Z");
  assert.equal(listUsers({ role: "viewer" }, PRODUCTION_LIKE).lastActive, null);
});

test("全員の一覧も 200", async () => {
  const r = await get("/api/users");
  assert.equal(r.status, 200);
  assert.equal(r.body.total, 4);
});
