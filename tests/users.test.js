import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";
import { handle } from "../src/server.js";

function get(path) {
  const res = {
    writeHead(status) { this.status = status; },
    end(body) { this.body = body; },
  };
  handle({ method: "GET", url: path }, res);
  return res;
}

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("team が null の利用者は team を null で返す", () => {
  const r = listUsers({}, [{ id: 1, name: "a", role: "user", team: null, lastActive: "2026-10-01T00:00:00Z" }]);
  assert.equal(r.users[0].team, null);
});

test("lastActive が null の利用者は lastActive の計算に入れない", () => {
  const users = [
    { id: 1, name: "a", role: "user", team: null, lastActive: null },
    { id: 2, name: "b", role: "user", team: { name: "t" }, lastActive: "2026-10-01T00:00:00Z" },
    { id: 3, name: "c", role: "user", team: null, lastActive: null },
  ];
  assert.equal(listUsers({}, users).lastActive, "2026-10-01T00:00:00Z");
  assert.equal(listUsers({}, [users[0]]).lastActive, null);
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});

for (const q of ["page=abc", "page=0", "page=-1", "size=abc", "size=0", "size=-1", "size=101"]) {
  test(`不正な ${q} は 400 invalid_query を返す`, () => {
    const res = get(`/api/users?${q}`);
    assert.equal(res.status, 400);
    assert.deepEqual(JSON.parse(res.body), { error: "invalid_query" });
  });
}

test("size=100 は有効", () => {
  assert.equal(get("/api/users?size=100").status, 200);
});

test("GET /api/users/:id は該当の利用者を返す", () => {
  const res = get("/api/users/1");
  assert.equal(res.status, 200);
  assert.equal(JSON.parse(res.body).id, 1);
  assert.equal(JSON.parse(res.body).name, "佐藤 花子");
});

test("GET /api/users/:id は存在しない id で 404 not_found を返す", () => {
  const res = get("/api/users/999");
  assert.equal(res.status, 404);
  assert.deepEqual(JSON.parse(res.body), { error: "not_found" });
});
