import sharp from "sharp";
import { readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";

const DIST_DIR = "dist";
const IMAGES_DIR = join(DIST_DIR, "images");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

async function getFiles(dir, extensions) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir.toString(), entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath, extensions)));
    } else if (extensions.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function getFileSize(filePath) {
  const s = await stat(filePath);
  return s.size;
}

async function convertImages() {
  const imageFiles = await getFiles(IMAGES_DIR, [".png", ".jpg", ".jpeg"]);

  if (imageFiles.length === 0) {
    console.log("No PNG/JPG images found to convert.");
    return { converted: 0, savedBytes: 0 };
  }

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let converted = 0;

  for (const filePath of imageFiles) {
    const originalSize = await getFileSize(filePath);
    totalOriginalSize += originalSize;

    const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");

    let pipeline = sharp(filePath);
    const metadata = await pipeline.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH);
    }

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    const newSize = await getFileSize(webpPath);
    totalNewSize += newSize;

    await unlink(filePath);
    converted++;

    const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(
      `  ${relative(DIST_DIR, filePath)} → .webp (${saved}% smaller)`
    );
  }

  return { converted, savedBytes: totalOriginalSize - totalNewSize };
}

async function updateHtmlReferences() {
  const htmlFiles = await getFiles(DIST_DIR, [".html"]);
  let updatedFiles = 0;

  for (const filePath of htmlFiles) {
    const content = await readFile(filePath, "utf-8");
    const updated = content
      .replace(/\.png/g, ".webp")
      .replace(/\.jpg/g, ".webp")
      .replace(/\.jpeg/g, ".webp");

    if (updated !== content) {
      await writeFile(filePath, updated, "utf-8");
      updatedFiles++;
    }
  }

  return updatedFiles;
}

async function main() {
  console.log("\n🖼️  Optimizing images...\n");

  const { converted, savedBytes } = await convertImages();
  const updatedHtml = await updateHtmlReferences();

  const savedMB = (savedBytes / 1024 / 1024).toFixed(1);

  console.log("\n--- Report ---");
  console.log(`Images converted: ${converted}`);
  console.log(`HTML files updated: ${updatedHtml}`);
  console.log(`Space saved: ${savedMB} MB`);
  console.log("");
}

main().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});
