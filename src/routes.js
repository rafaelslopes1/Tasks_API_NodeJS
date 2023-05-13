import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { csv } from "./middlewares/csv.js";
import { json } from "./middlewares/json.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handle: async (req, res) => {
      await json(req, res);

      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end("title and description is required");
      }

      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert("tasks", newTask);

      return res.end(JSON.stringify(newTask));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handle: async (req, res) => {
      await json(req, res);

      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handle: async (req, res) => {
      await json(req, res);

      const { title, description } = req.body;

      const { id } = req.params;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "title or description is required" }));
      }

      try {
        const updatedTask = database.update("tasks", id, {
          title,
          description,
        });
        return res.end(JSON.stringify(updatedTask));
      } catch (e) {
        return res.writeHead(404).end(JSON.stringify({ message: e.message }));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handle: async (req, res) => {
      await json(req, res);

      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handle: async (req, res) => {
      await json(req, res);

      const { id } = req.params;

      const completedTask = database.update("tasks", id, {
        completed_at: new Date(),
      });

      return res.end(JSON.stringify(completedTask));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/upload"),
    handle: async (req, res) => {
      await csv(req, res);

      const tasks = req.body;

      for (const task of tasks) {
        database.insert("tasks", {
          id: randomUUID(),
          ...task,
          completed_at: null,
          created_at: new Date(),
          updated_at: null,
        });
      }

      return res.end(JSON.stringify(tasks));
    },
  },
];
