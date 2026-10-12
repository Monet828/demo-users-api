import { USERS } from "./data.js";

export class InvalidQueryError extends Error {}
export class InvalidRoleError extends Error {}

const VALID_ROLES = ["admin", "member", "user", "guest", "viewer", "editor", "owner"];

/**
 * GET /api/users/:id の中身。見つからなければ null を返す。
 */
export function getUser(id, users = USERS) {
  const u = users.find((x) => String(x.id) === id);
  if (!u) return null;
  return { id: u.id, name: u.name, role: u.role, team: u.team?.name ?? null };
}

/**
 * GET /api/users の中身。role で絞り込み、page・size でページに分ける。
 * 返す形は docs/api.md のとおり。
 */
export function listUsers(query = {}, users = USERS) {
  const role = query.role || null;
  if (role && !VALID_ROLES.includes(role) && !users.some((u) => u.role === role)) throw new InvalidRoleError();
  const page = Number(query.page ?? 1);
  const size = Number(query.size ?? 20);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 100) {
    throw new InvalidQueryError();
  }
  const q = query.q ? String(query.q).toLowerCase() : null;
  const byRole = role ? users.filter((u) => u.role === role) : users;
  const matched = q ? byRole.filter((u) => u.name.toLowerCase().includes(q)) : byRole;
  const items = matched.slice((page - 1) * size, page * size).map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    team: u.team?.name ?? null,
  }));
  const active = matched.filter((u) => u.lastActive != null);
  const latest = active.length
    ? active.reduce((a, b) => (a.lastActive > b.lastActive ? a : b))
    : null;
  return { users: items, total: matched.length, page, lastActive: latest ? latest.lastActive : null };
}
