// scripts/optimize-assets.js
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { globby } from "globby";

// 📂 Folder sumber & tujuan
const SRC_DIR = path.resolve("src/assets");
const DEST_DIR = path.resolve("public/assets");

// 💡 Konversi semua gambar ke WebP dan kompres
async function optimizeImages() {
  console.log("🚀 Mulai optimasi aset...");
  const files = await globby(["**/*.{png,jpg,jpeg,webp}"], { cwd: SRC_DIR });

  let total = 0;
  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(DEST_DIR, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));

    // Pastikan folder tujuan ada
    await fs.ensureDir(path.dirname(destPath));

    try {
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(destPath);
      total++;

      // Optional: hapus file lama untuk hemat space
      // await fs.remove(srcPath);

      console.log(`✅ ${file} → ${path.relative(process.cwd(), destPath)}`);
    } catch (err) {
      console.error(`❌ Gagal optimasi: ${file}`, err);
    }
  }

  console.log(`\n✨ Selesai! ${total} file dikompres ke ${DEST_DIR}`);
}

optimizeImages();