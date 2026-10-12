import http from "node:http";
import { listUsers, getUser, InvalidQueryError } from "./users.js";

export function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/api/users") {
      const body = listUsers(Object.fromEntries(url.searchParams));
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(body));
    }
    const m = req.method === "GET" && url.pathname.match(/^\/api\/users\/([^/]+)$/);
    if (m) {
      const user = getUser(m[1]);
      if (user) {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify(user));
      }
    }
    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ status: "ok" }));
    }
    res.writeHead(404,{ "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (error) {
    if (error instanceof InvalidQueryError) {
      res.writeHead(400, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ error: "invalid_query" }));
    }
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "internal_error" }));
  }
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 3000);
  http.createServer(handle).listen(port, () => console.log(`listening on ${port}`));
}
