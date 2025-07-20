const fs = require("fs");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const tailwind = require("@tailwindcss/postcss");

const css = fs.readFileSync("src/css/styles.css", "utf8");

postcss([tailwind, autoprefixer])
  .process(css, {
    from: "src/css/styles.css",
    to: "public/css/styles.css",
  })
  .then((result) => {
    fs.mkdirSync("public/css", { recursive: true });
    fs.writeFileSync("public/css/styles.css", result.css);
    console.log("CSS built successfully");
  })
  .catch((err) => {
    console.error("PostCSS build failed:", err);
    process.exit(1);
  });