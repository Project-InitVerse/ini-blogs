import { Hono } from "hono";
import { cors } from "hono/cors";
import { Buffer } from "node:buffer";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/blogs/", async (c) => {
  const { results } = await c.env.DB.prepare("select * from blogs").all();
  let data = "";
  if (results) {
    try {
      data = results;
    } catch (e) {
      console.error(e);
    }
  }
  return c.json(
    data.map((blog) => ({
      ...blog,
      content: Buffer.from(blog.content, "base64").toString("utf-8"),
      metadata: JSON.parse(
        Buffer.from(blog.metadata, "base64").toString("utf-8")
      ),
    }))
  );
});

export default app;
