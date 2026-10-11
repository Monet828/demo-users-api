import { USERS } from "./data.js";

/**
 * GET /api/users の中身。role で絞り込み、page・size でページに分ける。
 * 返す形は docs/api.md のとおり。
 */
export function listUsers(query = {}, users = USERS) {
  const role = query.role || null;
  const page = Number(query.page ?? 1);
  const size = Number(query.size ?? 20);
  const matched = role ? users.filter((u) => u.role === role) : users;
  const items = matched.slice((page - 1) * size, page * size).map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    team: u.team?.name ?? null,
  }));
  // 該当者がいない場合や一度も使っていない利用者は計算に入れない
  const times = matched.map((u) => u.lastActive).filter(Boolean);
  const lastActive = times.length ? times.reduce((a, b) => (a > b ? a : b)) : null;
  return { users: items, total: matched.length, page, lastActive };
}
