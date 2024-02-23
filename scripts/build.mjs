import fs from "fs";
import { globby } from "globby";
import matter from "gray-matter";

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
}

fs.writeFileSync("release.json", JSON.stringify(blogs, null, 2));
