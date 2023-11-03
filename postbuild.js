import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = resolve(__dirname, 'dist', 'index.html');

// update the `dist/index.html` to change `/assets` to `assets` so the App loads assets correctly
async function updateIndexHtml() {
  try {
    const data = await fs.readFile(indexPath, 'utf8');
    const result = data.replace(/\/assets/g, 'assets');
    await fs.writeFile(indexPath, result, 'utf8');
    console.log('Successfully updated dist/index.html');
  } catch (err) {
    console.error('Error reading or writing index.html:', err);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

updateIndexHtml();
