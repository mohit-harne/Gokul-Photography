import fs from 'node:fs';
import path from 'node:path';

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg']);

export interface PublicImage {
  fileName: string;
  url: string; // e.g. "/gallery/wedding-1.jpg"
  name: string;       // Clean name without extension: "wedding-1"
  subfolder: string; // e.g. "wedding" or ""
}

/**
 * Recursively scans the public folder (or a specific subfolder inside public)
 * and returns all valid image paths suitable for browser <img src="..."> tags.
 *
 * @param subDir Optional subfolder inside public (e.g. 'wedding' or 'gallery')
 */
export function getPublicImages(subDir: string = ''): PublicImage[] {
  const publicDir = path.resolve(process.cwd(), 'public', subDir);

  if (!fs.existsSync(publicDir)) {
    return [];
  }

  const results: PublicImage[] = [];

  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (VALID_EXTENSIONS.has(ext)) {
          // Path relative to root of /public
          const relFromPublic = path.relative(path.resolve(process.cwd(), 'public'), fullPath);
          const webUrl = '/' + relFromPublic.split(path.sep).join('/');
          const cleanName = path.parse(entry.name).name;
          const folderName = path.dirname(relFromPublic) === '.' ? '' : path.dirname(relFromPublic);

          results.push({
            fileName: entry.name,
            url: webUrl,
            name: cleanName,
            subfolder: folderName,
          });
        }
      }
    }
  }

  scan(publicDir);
  return results;
}