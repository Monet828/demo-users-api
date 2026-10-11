import { USERS } from "./data.js";

/**
 * GET /api/users の中身。role で絞り込み、page・size でページに分ける。
 * 返す形は docs/api.md のとおり。
 */
export function listUsers(query = {}, users = USERS) {
  const role = query.role || null;
  const page = Number(query.page ?? 1);
  const size = Number(query.size ?? 20);
  // role を省略したときは社員（admin・member）だけ。業務委託（contractor）は role=contractor で明示したときだけ返す。
  const matched = role ? users.filter((u) => u.role === role) : users.filter((u) => u.role !== "contractor");
  const items = matched.slice((page - 1) * size, page * size).map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    team: u.team?.name ?? null,
  }));
  // 該当者がいないときは最終活動日時も無い。
  const latest = matched.length ? matched.reduce((a, b) => (a.lastActive > b.lastActive ? a : b)) : null;
  return { users: items, total: matched.length, page, lastActive: latest ? latest.lastActive : null };
}
