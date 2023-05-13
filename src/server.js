import http from "node:http";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const PORT = "3333";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (!route) {
    return res.writeHead(404).end();
  }

  const routeParams = req.url.match(route.path);

  const { query, ...params } = routeParams.groups;

  req.params = params;
  req.query = extractQueryParams(query);

  return await route.handle(req, res);
});

server.listen(PORT);
