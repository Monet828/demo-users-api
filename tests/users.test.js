import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("team が null の利用者は team を null で返す", () => {
  const users = [{ id: 1, name: "a", role: "member", team: null, lastActive: "2026-10-01T00:00:00Z" }];
  const r = listUsers({}, users);
  assert.equal(r.users[0].team, null);
});

test("lastActive が null の利用者は lastActive の計算に入れない", () => {
  const users = [
    { id: 1, name: "a", role: "member", team: null, lastActive: null },
    { id: 2, name: "b", role: "member", team: null, lastActive: "2026-10-01T00:00:00Z" },
  ];
  assert.equal(listUsers({}, users).lastActive, "2026-10-01T00:00:00Z");
  assert.equal(listUsers({}, [users[0]]).lastActive, null);
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});
