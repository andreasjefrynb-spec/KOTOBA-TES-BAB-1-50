const fs = require('fs');
const path = require('path');
const { ocrTextBab11_25 } = require('./ocr_11_25.cjs');
const { ocrTextBab26_50 } = require('./ocr_26_50.cjs');

// Read Bab 1-10 from generateKotoba.cjs
const generateKotobaCode = fs.readFileSync(path.join(__dirname, 'generateKotoba.cjs'), 'utf8');
const ocrPages = eval(generateKotobaCode.match(/const ocrPages = (\[[\s\S]*?\n\]);/)[1]);

function parseChapterBlock(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let currentChapter = 1;
  const items = [];

  for (const line of lines) {
    const babMatch = line.match(/^BAB\s+(\d+)/i);
    if (babMatch) {
      currentChapter = parseInt(babMatch[1], 10);
      continue;
    }

    const match = line.match(/^(\d+)\s+(.+)$/);
    if (match) {
      const no = parseInt(match[1], 10);
      const rest = match[2].trim();
      const tokens = rest.split(/\s+/);
      
      const japanese = tokens[0];
      let kanji = undefined;
      let indonesian = '';

      if (tokens.length >= 3 && !/^[A-Za-z(]/.test(tokens[1])) {
        kanji = tokens[1];
        indonesian = tokens.slice(2).join(' ');
      } else {
        indonesian = tokens.slice(1).join(' ');
      }

      items.push({
        no,
        chapter: currentChapter,
        japanese,
        kanji: kanji || undefined,
        indonesian: indonesian.trim()
      });
    }
  }

  return items;
}

let allParsed = [];

// 1. Bab 1-10
for (const p of ocrPages) {
  allParsed = allParsed.concat(parseChapterBlock(p));
}

// 2. Bab 11-25
allParsed = allParsed.concat(parseChapterBlock(ocrTextBab11_25));

// 3. Bab 26-50
allParsed = allParsed.concat(parseChapterBlock(ocrTextBab26_50));

console.log('Total parsed kotoba across all 50 chapters:', allParsed.length);

// Chapter counts summary
const chapterCounts = {};
for (const item of allParsed) {
  chapterCounts[item.chapter] = (chapterCounts[item.chapter] || 0) + 1;
}

console.log('Chapter Counts:');
for (let i = 1; i <= 50; i++) {
  console.log(`Bab ${i}: ${chapterCounts[i] || 0} kotoba`);
}

// Write to src/data/kotobaAll50.json
const outputPath = path.join(__dirname, '../src/data/kotobaAll50.json');
fs.writeFileSync(outputPath, JSON.stringify(allParsed, null, 2));
console.log('Saved to:', outputPath);
