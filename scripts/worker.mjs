import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/blogs/", async (c) => {
  const blogs = await c.env.INI_BLOGS.get("blogs");
  let data = "";
  if (blogs) {
    try {
      data = blogs;
    } catch (e) {
      console.error(e);
    }
  }
  return c.text(data);
});

export default app;
