#!/usr/bin/env node

/**
 * Generate placeholder PWA screenshot images
 * This creates simple SVG-based screenshots for the PWA manifest
 *
 * For production, replace these with actual app screenshots
 */

const fs = require("fs");
const path = require("path");

// SVG template for mobile screenshot
const createMobileScreenshot = () => `
<svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
  <rect width="390" height="844" fill="#F5F5F5"/>
  <rect width="390" height="60" fill="#0F8261"/>
  <text 
    x="195" 
    y="35" 
    font-family="Arial, sans-serif" 
    font-size="20" 
    font-weight="bold" 
    fill="#FFFFFF" 
    text-anchor="middle"
  >Nzelle</text>
  <rect x="20" y="100" width="350" height="200" rx="12" fill="#FFFFFF"/>
  <text 
    x="195" 
    y="210" 
    font-family="Arial, sans-serif" 
    font-size="18" 
    fill="#333333" 
    text-anchor="middle"
  >Investment Platform</text>
</svg>
`;

// SVG template for desktop screenshot
const createDesktopScreenshot = () => `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#F5F5F5"/>
  <rect width="1920" height="80" fill="#0F8261"/>
  <text 
    x="960" 
    y="50" 
    font-family="Arial, sans-serif" 
    font-size="28" 
    font-weight="bold" 
    fill="#FFFFFF" 
    text-anchor="middle"
  >Nzelle - Investment Platform</text>
  <rect x="100" y="150" width="1720" height="800" rx="16" fill="#FFFFFF"/>
  <text 
    x="960" 
    y="560" 
    font-family="Arial, sans-serif" 
    font-size="32" 
    fill="#333333" 
    text-anchor="middle"
  >Private-Market Investing</text>
</svg>
`;

// Create SVG files
const publicDir = path.join(__dirname, "..", "public");

// Generate mobile screenshot
fs.writeFileSync(
  path.join(publicDir, "screenshot-mobile.svg"),
  createMobileScreenshot(),
);

// Generate desktop screenshot
fs.writeFileSync(
  path.join(publicDir, "screenshot-desktop.svg"),
  createDesktopScreenshot(),
);

console.log("✓ Generated placeholder PWA screenshots (SVG format)");
console.log("  - public/screenshot-mobile.svg");
console.log("  - public/screenshot-desktop.svg");
console.log("");
console.log("Note: For production, replace these with actual app screenshots");
