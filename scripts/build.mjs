import fs from "fs";
import { globby } from "globby";
import matter from "gray-matter";

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
  blogs.push(data);
}

fs.writeFileSync("release.json", JSON.stringify(blogs, null, 2));
