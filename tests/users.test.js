import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("role=guest で該当者なしのとき空の一覧を返す", () => {
  const r = listUsers({ role: "guest" });
  assert.deepEqual(r.users, []);
  assert.equal(r.total, 0);
  assert.equal(r.lastActive, null);
});

test("team が無い・一度も使っていない利用者でも落ちない", () => {
  const users = [
    { id: 1, name: "a", role: "member", team: null, lastActive: null },
    { id: 2, name: "b", role: "member", team: { id: 1, name: "基盤" }, lastActive: "2026-10-09T09:12:00Z" },
  ];
  const r = listUsers({}, users);
  assert.equal(r.users[0].team, null);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
  assert.equal(listUsers({}, users.slice(0, 1)).lastActive, null);
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});
