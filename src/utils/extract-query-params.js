export function extractQueryParams(query) {
  if (!query) return {};

  return query
    .substr(1)
    .split("&")
    .reduce((queryParams, param) => {
      const [key, value] = param.split("=");
      queryParams[key] = value;
    }, {});
}
