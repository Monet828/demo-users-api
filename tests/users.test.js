import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";
import { USERS } from "../src/data.js";

test("全員を返す", () => {
  const r = listUsers({});
  assert.equal(r.total, 4);
  assert.equal(r.users[0].name, "佐藤 花子");
});

test("role=guest で該当者がいなければ空の一覧を返す", () => {
  const r = listUsers({ role: "guest" });
  assert.deepEqual(r.users, []);
  assert.equal(r.total, 0);
  assert.equal(r.lastActive, null);
});

test("team を持たない guest も一覧に含める", () => {
  const guest = { id: 9, name: "来客", role: "guest", team: null, lastActive: "2026-10-01T00:00:00Z" };
  const r = listUsers({ role: "guest" }, [...USERS, guest]);
  assert.deepEqual(r.users, [{ id: 9, name: "来客", role: "guest", team: null }]);
});

test("一度も使っていない利用者は lastActive の計算に入れない", () => {
  const unused = { id: 9, name: "未使用", role: "member", team: null, lastActive: null };
  const r = listUsers({ role: "member" }, [...USERS, unused]);
  assert.equal(r.lastActive, "2026-10-11T02:15:00Z");
  const r2 = listUsers({ role: "member" }, [unused, ...USERS]);
  assert.equal(r2.lastActive, "2026-10-11T02:15:00Z");
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});
