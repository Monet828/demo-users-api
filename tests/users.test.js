import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});

test("該当者がいない role は空の一覧を返す", () => {
  const r = listUsers({ role: "guest" });
  assert.deepEqual(r.users, []);
  assert.equal(r.total, 0);
  assert.equal(r.lastActive, null);
});

test("team が null・lastActive が null の利用者を扱える", () => {
  const users = [
    { id: 1, name: "a", role: "guest", team: null, lastActive: null },
    { id: 2, name: "b", role: "guest", team: null, lastActive: "2026-10-01T00:00:00Z" },
  ];
  const r = listUsers({ role: "guest" }, users);
  assert.deepEqual(r.users.map((u) => u.team), [null, null]);
  assert.equal(r.lastActive, "2026-10-01T00:00:00Z");
});
