import http from "node:http";
import { listUsers } from "./users.js";

export function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/api/users") {
      const query = Object.fromEntries(url.searchParams);
      if (query.size !== undefined && Number(query.size) > 100) {
        res.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ error: "invalid_query" }));
      }
      const body = listUsers(query);
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(body));
    }
    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ status: "ok" }));
    }
    res.writeHead(404,{ "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "internal_error" }));
  }
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 3000);
  http.createServer(handle).listen(port, () => console.log(`listening on ${port}`));
}
