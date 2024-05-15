import fs from "fs";
import { globby } from "globby";
import matter from "gray-matter";

import { execa } from "execa";

import MarkdownIt from "markdown-it";
import MarkdownItVideo from "markdown-it-video";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typography: true,
}).use(MarkdownItVideo, {
  youtube: { width: "100%", height: 500 },
});

const blogs = [];

const mdFiles = await globby("blogs", {
  expandDirectories: {
    files: ["*.md"],
  },
});

const deleteOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  },
  body: `{"params":[], "sql":"DELETE FROM blogs"}`,
};

await fetch(
  "https://api.cloudflare.com/client/v4/accounts/8e2a1b540c70742df690323fb89c4774/d1/database/59e59aaa-910d-4b48-9d61-e8b254254bbd/query",
  deleteOptions
);

for (const mdFile of mdFiles) {
  const mdContent = fs.readFileSync(mdFile, "utf-8");
  const data = matter(mdContent);
  data.path = mdFile.replace("blogs/", "").replace(".md", "");
  data.content = md.render(data.content);
  blogs.push(data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
    body: `{"params":[], "sql":"INSERT INTO blogs (path, content, metadata) VALUES('${
      data.path
    }', '${toBase64(data.content)}', '${toBase64(
      JSON.stringify(data.data)
    )}')"}`,
  };

  await fetch(
    "https://api.cloudflare.com/client/v4/accounts/8e2a1b540c70742df690323fb89c4774/d1/database/59e59aaa-910d-4b48-9d61-e8b254254bbd/query",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(`Published ${data.path}!`);
    })
    .catch((err) => console.error(err));
  // await execa("wrangler", [
  //   "d1",
  //   "execute",
  //   "DB",
  //   "--command",
  //   `INSERT INTO blogs (path, content, metadata) VALUES ("${
  //     data.path
  //   }", "${toBase64(data.content)}", "${toBase64(JSON.stringify(data.data))}")`,
  // ]);
}

fs.writeFileSync(
  "release.txt",
  Buffer.from(JSON.stringify(blogs)).toString("base64")
);

function toBase64(str) {
  return Buffer.from(str).toString("base64");
}
