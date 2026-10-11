# API

## GET /api/users

利用者の一覧を返す。

| query | 意味 |
|---|---|
| role | この role の利用者だけ（省略すると全員） |
| page | 1 から（既定 1） |
| size | 1 ページの件数（既定 20） |

応答（200）：

```json
{ "users": [{ "id": 1, "name": "…", "role": "admin", "team": "基盤" }], "total": 1, "page": 1, "lastActive": "2026-10-09T09:12:00Z" }
```

- `lastActive` は、絞り込んだ利用者のうち最後に使った時刻。

## API の使い方とエラーの応答

| status | body | いつ |
|---|---|---|
| 200 | 上の形 | 一致する利用者がいない場合も 200 で `users: []`・`total: 0`・`lastActive: null` |
| 404 | `{ "error": "not_found" }` | 知らない path |
| 500 | `{ "error": "internal_error" }` | 予期しない失敗（ログを確かめる） |

## GET /health

死活監視用。200 で `{ "status": "ok" }` を返す。
