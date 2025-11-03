// scripts/optimize-assets.js
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { globby } from "globby";

const SRC_DIR = path.resolve("src/assets");
const DEST_DIR = path.resolve("public/assets");
const INDEX_FILE = path.resolve("src/data/mediaIndex.json");

// Helper: convert image to webp
async function optimizeImage(src, dest) {
  await fs.ensureDir(path.dirname(dest));
  await sharp(src)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
}

// Helper: convert video to mp4/webm
async function optimizeVideo(src, dest) {
  await fs.ensureDir(path.dirname(dest));

  return new Promise((resolve, reject) => {
    ffmpeg(src)
      .outputOptions([
        "-c:v libx264",
        "-crf 28",
        "-preset veryfast",
        "-pix_fmt yuv420p",
      ])
      .output(dest)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

async function optimizeAssets() {
  console.log("🚀 Mulai optimasi semua aset...");
  const files = await globby(
    ["**/*.{png,jpg,jpeg,webp,mp4,mov,avi,mkv,webm}"],
    { cwd: SRC_DIR }
  );

  const mediaIndex = {};
  let total = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    let destPath;

    // Gambar → ubah ke webp
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      destPath = path.join(
        DEST_DIR,
        file.replace(/\.(png|jpg|jpeg)$/i, ".webp")
      );
      await optimizeImage(srcPath, destPath);
    }

    // Video → ubah ke mp4 (universal)
    else if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
      destPath = path.join(
        DEST_DIR,
        file.replace(/\.(mov|avi|mkv|webm)$/i, ".mp4")
      );
      await optimizeVideo(srcPath, destPath);
    } else continue;

    total++;
    const publicPath = `/assets/${path.relative(
      SRC_DIR,
      destPath
    )}`.replace(/\\/g, "/");

    // Simpan berdasarkan folder
    const folder = path.dirname(file).split(path.sep)[0] || "root";
    mediaIndex[folder] = mediaIndex[folder] || [];
    mediaIndex[folder].push(publicPath);

    console.log(`✅ ${file} → ${publicPath}`);
  }

  await fs.ensureDir(path.dirname(INDEX_FILE));
  await fs.writeJSON(INDEX_FILE, mediaIndex, { spaces: 2 });

  console.log(`\n✨ ${total} file dioptimasi ke ${DEST_DIR}`);
  console.log(`🧭 Media index dibuat di: ${INDEX_FILE}`);
}

optimizeAssets();