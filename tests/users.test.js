import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";

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

test("role=guest の利用者だけを返す", () => {
  const guest = { id: 9, name: "客 太郎", role: "guest", team: null, lastActive: "2026-10-01T00:00:00Z" };
  const r = listUsers({ role: "guest" }, [guest, { ...guest, id: 10, role: "member" }]);
  assert.deepEqual(r.users.map((u) => u.id), [9]);
  assert.equal(r.users[0].team, null);
});

test("role で絞り込む", () => {
  const r = listUsers({ role: "admin" });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.equal(r.lastActive, "2026-10-09T09:12:00Z");
});
