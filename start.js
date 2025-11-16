#!/usr/bin/env node
// Generate trianglify SVG patterns
// Usage: node start.js [--settings <json>] [count]
//   --settings: JSON string with trianglify settings
//   count: Number of examples to generate (1-100, default: 1)

import fs from 'fs';
import path from 'path';
import trianglify from 'trianglify';

const colorbrewer = trianglify.utils.colorbrewer;

// Parse command line arguments
const args = process.argv.slice(2);
let count = 1;
let settings = {
    width: 1000,
    height: 1000,
};
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--settings') {
        if (i + 1 >= args.length) {
            console.error('Error: --settings requires a JSON argument');
            process.exit(1);
        }
        try {
            Object.assign(settings, JSON.parse(args[i + 1]));
        } catch (e) {
            console.error('Error: Invalid JSON in --settings argument');
            process.exit(1);
        }
        i++; // Skip the JSON argument
    } else if (!isNaN(parseInt(args[i], 10))) {
        count = parseInt(args[i], 10);
        if (count < 1 || count > 100) {
            console.error('Error: Count must be a number between 1 and 100');
            console.error('Usage: node start.js [--settings <json>] [count]');
            process.exit(1);
        }
    }
}

// Create output directory
const outputDir = 'generated-files';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function randomInt(low, high) {
    return Math.floor(low + Math.random() * (high - low));
}

function randomHexColor(low, high) {
    const parts = Array(3).fill(null).map(() => randomInt(low, high));
    return '#' + parts.map(p => p.toString(16).padStart(2, '0')).join('');
}

function makeRandomPalette() {
    const isLong = Math.random() > 0.5;
    return [
        randomHexColor(0, 255),
        isLong ? randomHexColor(80, 255) : null,
        randomHexColor(180, 255),
        isLong ? randomHexColor(80, 255) : null,
        randomHexColor(0, 255)
    ].filter(Boolean);
}

function svgFilename(counter) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `trianglify-${year}${month}${day}-${counter}.svg`;
}

function countFiles(dir, pattern) {
    const re = new RegExp(`^${pattern}$`);
    const files = fs.readdirSync(dir);
    return files.filter(file => re.test(file)).length + 1;
}

// Generate SVGs
const randomPalettes = Array(25).fill(null).map(makeRandomPalette);
const palettes = [...Object.values(colorbrewer), ...randomPalettes];
const start = countFiles(outputDir, svgFilename('.*'));
for (let i = 0; i < count; i++) {
    let opts = {
        cellSize: randomInt(25, 75),
        xColors: palettes[Math.floor(Math.random() * palettes.length)],
        variance: randomInt(50, 100) / 100,
        seed: Math.random(),
        ...settings,
    };
    const svg = trianglify(opts).toSVG();
    const comment = `<!-- Trianglify Settings: ${JSON.stringify(opts)} -->\n\n`;
    const filename = svgFilename(start + i);
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, comment + svg);
    console.log(`Created ${filepath}`);
}
