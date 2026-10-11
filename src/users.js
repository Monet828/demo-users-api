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
  // 一度も使っていない利用者（lastActive が null）は計算に入れない
  const active = matched.filter((u) => u.lastActive != null);
  const lastActive = active.length
    ? active.reduce((a, b) => (a.lastActive > b.lastActive ? a : b)).lastActive
    : null;
  return { users: items, total: matched.length, page, lastActive };
}
