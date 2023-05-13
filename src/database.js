import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url).pathname;

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    return this.#database[table] ?? [];
  }

  insert(table, data) {
    if (!Array.isArray(this.#database[table])) {
      this.#database[table] = [];
    }

    this.#database[table].push(data);

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      throw new Error(`ID ${id} not found`);
    }

    const row = { ...this.#database[table][rowIndex] };

    for (const key in data) {
      row[key] = data[key] !== undefined ? data[key] : row[key];
    }

    row.updated_at = new Date();

    this.#database[table][rowIndex] = row;

    this.#persist();

    return row;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      throw new Error(`ID ${id} not found`);
    }

    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }
}
