import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("該当者がいない role は空の一覧を返す", () => {
  for (const role of ["guest", "unknown"]) {
    const r = listUsers({ role });
    assert.deepEqual(r.users, []);
    assert.equal(r.total, 0);
    assert.equal(r.lastActive, null);
  }
});

test("role=guest の利用者がいればその人だけを返す", () => {
  const guest = { id: 9, name: "来客", role: "guest", team: { id: 10, name: "基盤" }, lastActive: "2026-10-01T00:00:00Z" };
  const r = listUsers({ role: "guest" }, [...listUsers({}).users.map((u) => ({ ...u, team: { name: u.team }, lastActive: "2026-10-02T00:00:00Z" })), guest]);
  assert.deepEqual(r.users.map((u) => u.id), [9]);
  assert.equal(r.lastActive, "2026-10-01T00:00:00Z");
});

test("チームなし・未使用の利用者でも落ちない", () => {
  const users = [
    { id: 1, name: "A", role: "member", team: null, lastActive: null },
    { id: 2, name: "B", role: "member", team: { id: 1, name: "基盤" }, lastActive: "2026-10-01T00:00:00Z" },
  ];
  const r = listUsers({}, users);
  assert.equal(r.users[0].team, null);
  assert.equal(r.lastActive, "2026-10-01T00:00:00Z");
  assert.equal(listUsers({}, users.slice(0, 1)).lastActive, null);
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});
