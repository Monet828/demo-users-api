import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../src/users.js";
import { USERS } from "../src/data.js";

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

test("チームに属さない利用者は team が null、未使用の利用者は lastActive に入れない", () => {
  const loner = { id: 8, name: "無所属", role: "member", team: null, lastActive: null };
  const r = listUsers({ role: "member" }, [...USERS, loner]);
  assert.equal(r.users.find((u) => u.id === 8).team, null);
  assert.equal(r.lastActive, "2026-10-11T02:15:00Z");
  assert.equal(listUsers({}, [loner]).lastActive, null);
});

test("role=guest の利用者がいればその人だけを返す", () => {
  const guest = { id: 9, name: "来客", role: "guest", team: { id: 10, name: "基盤" }, lastActive: "2026-10-01T00:00:00Z" };
  const r = listUsers({ role: "guest" }, [...USERS, guest]);
  assert.deepEqual(r.users.map((u) => u.id), [9]);
});
