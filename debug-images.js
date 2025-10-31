import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'src/assets/list-products/2D');

function debugFolder(folderPath) {
  const folderName = path.basename(folderPath);
  const files = fs.readdirSync(folderPath);
  
  console.log(`\n📁 Folder: ${folderName}`);
  console.log('─'.repeat(50));
  
  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const fileLower = file.toLowerCase();
      const baseName = fileLower
        .replace(/\.[a-z0-9]+$/i, '')           // hapus ekstensi
        .replace(/-[a-z0-9]{6,10}$/i, '');      // hapus hash Vite
      
      const isMain = ['mainimage', 'main-image', 'main_image', 'main'].some(pattern =>
        baseName === pattern || baseName.startsWith(pattern + '-')
      );
      
      console.log(`   ${isMain ? '👉' : '  '} ${file}`);
      console.log(`      └─ base: "${baseName}" | isMain: ${isMain}`);
    }
  });
}

console.log('🔍 Debugging Image Files...\n');

// Cek semua subfolder 2D
const subfolders = ['4R', '6R', '8R', '12R', '15cm'];

subfolders.forEach(folder => {
  const fullPath = path.join(TARGET_DIR, folder);
  if (fs.existsSync(fullPath)) {
    debugFolder(fullPath);
  } else {
    console.log(`\n❌ Folder not found: ${folder}`);
  }
});