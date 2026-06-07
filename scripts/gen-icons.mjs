// Generates PWA/app icons (a white water droplet on a green background) as PNGs
// with zero dependencies — pure Node (zlib + manual PNG encoding).
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');
const iconsDir = resolve(publicDir, 'icons');
mkdirSync(iconsDir, { recursive: true });

const GREEN = [22, 163, 74]; // #16a34a
const WHITE = [255, 255, 255];

// CRC32
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  // rest 0
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Draw a droplet on a (optionally rounded) green background.
// `padding` is the fraction of the canvas kept clear around the droplet.
function drawIcon(size, { rounded = true, padding = 0.18 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const cornerR = rounded ? size * 0.22 : 0;

  // droplet geometry within the safe area
  const inset = size * padding;
  const avail = size - inset * 2;
  const r = avail * 0.3; // bottom circle radius
  const cx = size / 2;
  const cy = size / 2 + avail * 0.16; // circle center
  const topY = cy - r * 2.3;

  const inRoundedRect = (x, y) => {
    if (cornerR === 0) return true;
    const minX = cornerR,
      maxX = size - cornerR,
      minY = cornerR,
      maxY = size - cornerR;
    let dx = 0,
      dy = 0;
    if (x < minX) dx = minX - x;
    else if (x > maxX) dx = x - maxX;
    if (y < minY) dy = minY - y;
    else if (y > maxY) dy = y - maxY;
    return dx * dx + dy * dy <= cornerR * cornerR;
  };

  const inDroplet = (x, y) => {
    if (y >= cy) {
      const dx = x - cx,
        dy = y - cy;
      return dx * dx + dy * dy <= r * r;
    }
    if (y >= topY) {
      const halfWidth = r * ((y - topY) / (cy - topY)) ** 1.1;
      return Math.abs(x - cx) <= halfWidth;
    }
    return false;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!inRoundedRect(x + 0.5, y + 0.5)) {
        buf[i] = buf[i + 1] = buf[i + 2] = buf[i + 3] = 0; // transparent corner
        continue;
      }
      const [cr, cg, cb] = inDroplet(x + 0.5, y + 0.5) ? WHITE : GREEN;
      buf[i] = cr;
      buf[i + 1] = cg;
      buf[i + 2] = cb;
      buf[i + 3] = 255;
    }
  }
  return buf;
}

function write(name, size, opts) {
  writeFileSync(resolve(iconsDir, name), encodePng(size, drawIcon(size, opts)));
  console.log('wrote icons/' + name);
}

write('pwa-192.png', 192, { rounded: true });
write('pwa-512.png', 512, { rounded: true });
write('pwa-512-maskable.png', 512, { rounded: false, padding: 0.26 });
write('apple-touch-icon.png', 180, { rounded: false });

// SVG favicon (crisp at any size)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#16a34a"/>
  <path d="M32 12 C 40 26, 46 32, 46 42 a 14 14 0 0 1 -28 0 C 18 32, 24 26, 32 12 Z" fill="#fff"/>
</svg>
`;
writeFileSync(resolve(publicDir, 'favicon.svg'), favicon);
console.log('wrote favicon.svg');
