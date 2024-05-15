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

for (const mdFile of mdFiles) {
  const mdContent = fs.readFileSync(mdFile, "utf-8");
  const data = matter(mdContent);
  data.path = mdFile.replace("blogs/", "").replace(".md", "");
  data.content = md.render(data.content);
  blogs.push(data);

  console.log(`Publishing ${data.path}...`);

  await execa("wrangler", [
    "d1",
    "execute",
    "DB",
    "--command",
    `INSERT INTO blogs (path, content, metadata) VALUES ("${
      data.path
    }", "${toBase64(data.content)}", "${toBase64(JSON.stringify(data.data))}")`,
  ]);
}

fs.writeFileSync(
  "release.txt",
  Buffer.from(JSON.stringify(blogs)).toString("base64")
);

function toBase64(str) {
  return Buffer.from(str).toString("base64");
}
