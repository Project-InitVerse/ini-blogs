import { execa } from "execa";

import fs from "node:fs";

const content = fs.readFileSync("release.json", "utf-8");

const blogs = JSON.parse(content);

for (const blog of blogs) {
  await execa(
    "wrangler kv:key put --binding=INI_BLOGS",
    [blog.path, blog.content],
    ["--metadata", JSON.stringify(blog.data)]
  );
}
