// 本番に近いデータ（CI だけが使う）。チームに属していない利用者・一度も使っていない利用者がいる。
export const PRODUCTION_LIKE = [
  { id: 1, name: "佐藤 花子", role: "admin", team: { id: 10, name: "基盤" }, lastActive: "2026-10-09T09:12:00Z" },
  { id: 2, name: "鈴木 一郎", role: "member", team: { id: 11, name: "決済" }, lastActive: "2026-10-10T18:40:00Z" },
  { id: 4, name: "田中 健", role: "member", team: null, lastActive: "2026-10-07T12:30:00Z" },
  { id: 6, name: "山本 翔", role: "member", team: { id: 12, name: "検索" }, lastActive: null },
  { id: 7, name: "中村 葵", role: "viewer", team: { id: 12, name: "検索" }, lastActive: null },
];
