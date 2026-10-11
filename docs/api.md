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
