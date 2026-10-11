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
    team: u.team ? u.team.name : null,
  }));
  const used = matched.filter((u) => u.lastActive);
  const latest = used.length
    ? used.reduce((a, b) => (a.lastActive > b.lastActive ? a : b))
    : null;
  return { users: items, total: matched.length, page, lastActive: latest ? latest.lastActive : null };
}
