import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi
const TARGET_DIR = path.join(__dirname, 'src/assets/list-products');
const DRY_RUN = false; // Set true untuk testing tanpa ubah file

// Counter statistik
let stats = {
  processed: 0,
  renamed: 0,
  skipped: 0,
  errors: 0
};

/**
 * Konversi nama file ke kebab-case lowercase
 */
function toKebabCase(filename) {
  const ext = path.extname(filename);
  const nameWithoutExt = filename.slice(0, -ext.length);
  
  return nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')           // spasi → dash
    .replace(/_+/g, '-')            // underscore → dash
    .replace(/[^a-z0-9-]/g, '')     // hapus karakter spesial
    .replace(/-+/g, '-')            // dash ganda → single
    .replace(/^-|-$/g, '')          // hapus dash di awal/akhir
    + ext.toLowerCase();
}

/**
 * Rekursif scan & rename files
 */
function processDirectory(dirPath) {
  let entries;
  
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.error(`❌ Error reading directory: ${dirPath}`);
    stats.errors++;
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Rekursif ke subfolder
      processDirectory(fullPath);
      continue;
    }

    if (!entry.isFile()) continue;

    stats.processed++;
    
    // Cek ekstensi file yang valid
    const ext = path.extname(entry.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.jfif', '.mp4'].includes(ext)) {
      stats.skipped++;
      continue;
    }

    // Generate nama baru
    const newName = toKebabCase(entry.name);
    
    // Skip jika nama sudah benar
    if (entry.name === newName) {
      stats.skipped++;
      continue;
    }

    const newPath = path.join(dirPath, newName);
    
    // Cek konflik nama file
    if (fs.existsSync(newPath)) {
      console.warn(`⚠️  Conflict detected, skipping: ${entry.name}`);
      console.warn(`   → Target exists: ${newName}`);
      stats.skipped++;
      continue;
    }

    // Rename file
    try {
      if (!DRY_RUN) {
        fs.renameSync(fullPath, newPath);
      }
      
      console.log(`✅ Renamed:`);
      console.log(`   FROM: ${entry.name}`);
      console.log(`   TO:   ${newName}`);
      console.log(`   PATH: ${path.relative(TARGET_DIR, dirPath)}\n`);
      
      stats.renamed++;
      
    } catch (err) {
      console.error(`❌ Error renaming: ${entry.name}`);
      console.error(`   ${err.message}\n`);
      stats.errors++;
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting filename normalization...\n');
  console.log(`📁 Target directory: ${TARGET_DIR}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE (will rename files)'}\n`);
  console.log('─'.repeat(60) + '\n');

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }

  const startTime = Date.now();
  processDirectory(TARGET_DIR);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('─'.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   Files processed: ${stats.processed}`);
  console.log(`   Files renamed:   ${stats.renamed}`);
  console.log(`   Files skipped:   ${stats.skipped}`);
  console.log(`   Errors:          ${stats.errors}`);
  console.log(`   Duration:        ${duration}s\n`);

  if (DRY_RUN) {
    console.log('💡 This was a DRY RUN. Set DRY_RUN = false to apply changes.\n');
  } else {
    console.log('✨ All done! Files have been renamed.\n');
  }
}

main();