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

test("該当する利用者がいない role は空の一覧を返す", () => {
  const r = listUsers({ role: "guest" });
  assert.deepEqual(r.users, []);
  assert.equal(r.total, 0);
  assert.equal(r.lastActive, null);
});

test("チーム未所属の利用者は team が null、未使用の利用者は lastActive に入れない", () => {
  const users = [
    { id: 1, name: "A", role: "member", team: null, lastActive: null },
    { id: 2, name: "B", role: "member", team: { id: 1, name: "t" }, lastActive: "2026-10-02T00:00:00Z" },
  ];
  const r = listUsers({}, users);
  assert.equal(r.users[0].team, null);
  assert.equal(r.lastActive, "2026-10-02T00:00:00Z");
  assert.equal(listUsers({}, [users[0]]).lastActive, null);
});

test("role=guest の利用者がいればその利用者だけを返す", () => {
  const users = [
    { id: 1, name: "A", role: "admin", team: { id: 1, name: "t" }, lastActive: "2026-10-01T00:00:00Z" },
    { id: 9, name: "G", role: "guest", team: { id: 1, name: "t" }, lastActive: "2026-10-02T00:00:00Z" },
  ];
  const r = listUsers({ role: "guest" }, users);
  assert.deepEqual(r.users.map((u) => u.id), [9]);
  assert.equal(r.lastActive, "2026-10-02T00:00:00Z");
});
