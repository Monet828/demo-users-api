import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";
import { handle } from "../src/server.js";

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

function get(url) {
  const res = {
    writeHead(code) { this.statusCode = code; },
    end(body) { this.body = body; },
  };
  handle({ method: "GET", url }, res);
  return res;
}

for (const q of ["page=abc", "page=0", "page=-1", "size=abc", "size=0", "size=-1", "size=101"]) {
  test(`不正なクエリ ${q} は statusCode(400) と {"error":"invalid_query"} を返す`, () => {
    const res = get(`/api/users?${q}`);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body, '{"error":"invalid_query"}');
  });
}

test("size=100 は有効値として 200 を返す", () => {
  assert.equal(get("/api/users?size=100").statusCode, 200);
});
