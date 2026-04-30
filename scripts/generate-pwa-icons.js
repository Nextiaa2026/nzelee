#!/usr/bin/env node

/**
 * Generate placeholder PWA icons
 * This creates simple SVG-based PNG icons for the PWA manifest
 *
 * For production, replace these with professionally designed icons
 */

const fs = require("fs");
const path = require("path");

// SVG template for the icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0F8261"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${size * 0.3}" 
    font-weight="bold" 
    fill="#FFFFFF" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >N</text>
</svg>
`;

// Create SVG files
const publicDir = path.join(__dirname, "..", "public");

// Generate 192x192 icon
fs.writeFileSync(path.join(publicDir, "icon-192.svg"), createSVG(192));

// Generate 512x512 icon
fs.writeFileSync(path.join(publicDir, "icon-512.svg"), createSVG(512));

console.log("✓ Generated placeholder PWA icons (SVG format)");
console.log("  - public/icon-192.svg");
console.log("  - public/icon-512.svg");
console.log("");
console.log(
  "Note: For production, replace these with professionally designed PNG icons",
);
