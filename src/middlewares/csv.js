import { parse } from "csv-parse";

export async function csv(req, res) {
  const csvParse = parse({
    delimiter: ",",
    skipEmptyLines: true,
    fromLine: 2, // skip the header line
  });

  const linesParse = req.pipe(csvParse);

  const body = [];

  for await (const line of linesParse) {
    const [title, description] = line;
    body.push({
      title,
      description,
    });
  }

  req.body = body;

  res.setHeader("Content-type", "application/json");
}
