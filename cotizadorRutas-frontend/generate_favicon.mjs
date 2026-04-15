import { createCanvas } from 'canvas';
import fs from 'fs';

const SIZE = 512;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, SIZE, SIZE);

const pinColor = '#3B82F6';
ctx.fillStyle = pinColor;

// ── Draw pin as circle + separate triangle tail ──
const cx = 240;
const cy = 190;
const r = 170;

// 1. Main circle body
ctx.beginPath();
ctx.arc(cx, cy, r, 0, Math.PI * 2);
ctx.fill();

// 2. Triangle tail pointing to lower-right (Q shape)
ctx.beginPath();

// Left attachment: ~7 o'clock position on circle
const angL = Math.PI * 0.65;
const lx = cx + r * Math.cos(angL);
const ly = cy + r * Math.sin(angL);

// Right attachment: ~5 o'clock position  
const angR = Math.PI * 0.28;
const rx = cx + r * Math.cos(angR);
const ry = cy + r * Math.sin(angR);

// Sharp tip - slightly to the right of center
const tipX = cx + 45;
const tipY = cy + r + 130;

ctx.moveTo(lx, ly);
// Left curve to tip
ctx.quadraticCurveTo(lx + 30, ly + 70, tipX, tipY);
// Right curve from tip
ctx.quadraticCurveTo(rx + 10, ry + 50, rx, ry);
ctx.closePath();
ctx.fill();

// 3. White rounded square cutout
const sqSize = 133;
const sqRad = 26;
const sqX = cx - sqSize / 2;
const sqY = cy - sqSize / 2;

ctx.fillStyle = '#FFFFFF';
ctx.beginPath();
ctx.moveTo(sqX + sqRad, sqY);
ctx.lineTo(sqX + sqSize - sqRad, sqY);
ctx.quadraticCurveTo(sqX + sqSize, sqY, sqX + sqSize, sqY + sqRad);
ctx.lineTo(sqX + sqSize, sqY + sqSize - sqRad);
ctx.quadraticCurveTo(sqX + sqSize, sqY + sqSize, sqX + sqSize - sqRad, sqY + sqSize);
ctx.lineTo(sqX + sqRad, sqY + sqSize);
ctx.quadraticCurveTo(sqX, sqY + sqSize, sqX, sqY + sqSize - sqRad);
ctx.lineTo(sqX, sqY + sqRad);
ctx.quadraticCurveTo(sqX, sqY, sqX + sqRad, sqY);
ctx.closePath();
ctx.fill();

// Save
const buf = canvas.toBuffer('image/png');
fs.writeFileSync('c:\\Users\\BOURGEOIS\\Desktop\\quotargo_favicon_v5.png', buf);
console.log('✅ V5 saved');
