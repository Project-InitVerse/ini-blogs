import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/blogs/", async (c) => {
  const blogs = await c.env.INI_BLOGS.get("blogs");
  let data = [];
  try {
    data = JSON.parse(blogs);
  } catch (e) {}
  return c.json({ data });
});

export default app;
