// 利用者のサンプルデータ（本番では DB から読む）。
export const USERS = [
  { id: 1, name: "佐藤 花子", role: "admin", team: { id: 10, name: "基盤" }, lastActive: "2026-10-09T09:12:00Z" },
  { id: 2, name: "鈴木 一郎", role: "member", team: { id: 11, name: "決済" }, lastActive: "2026-10-10T18:40:00Z" },
  { id: 3, name: "高橋 美咲", role: "member", team: { id: 10, name: "基盤" }, lastActive: "2026-10-08T07:05:00Z" },
  { id: 4, name: "田中 健", role: "contractor", team: null, lastActive: "2026-10-07T12:30:00Z" },
  { id: 5, name: "伊藤 さくら", role: "member", team: { id: 12, name: "検索" }, lastActive: "2026-10-11T02:15:00Z" },
];
