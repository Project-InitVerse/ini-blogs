import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/blogs/", async (c) => {
  const blogs = await c.env.INI_BLOGS.get("blogs");
  return c.json({ blogs });
});

export default app;
