import * as fs from 'fs';

const FILE = './src/resources.ts';

function main() {
  const content = fs.readFileSync(FILE, 'utf-8');
  const lines = content.split('\n');

  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Detect translation: {
    if (/^\s*translation:\s*\{\s*$/.test(line)) {
      result.push(line);
      i++;
      const r = processTranslation(lines, i);
      result.push(...r.lines);
      i = r.idx;
    } else {
      result.push(line);
      i++;
    }
  }

  fs.writeFileSync(FILE, result.join('\n'), 'utf-8');
  console.log('Sorted resources.ts');
}

/** Process the translation block: sort leaves inside each comment block, then handle object blocks. */
function processTranslation(lines: string[], startIdx: number) {
  const result: string[] = [];
  let i = startIdx;

  let curHeader: string[] = [];
  let curProps: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '}' || trimmed === '},') {
      break;
    }

    // Object block starts (e.g. apiMessages: {)
    if (/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:\s*\{$/.test(trimmed)) {
      break;
    }

    if (trimmed === '') {
      if (curHeader.length > 0 || curProps.length > 0) {
        result.push(...curHeader);
        result.push(...sortProperties(curProps));
        result.push('');
        curHeader = [];
        curProps = [];
      }
      i++;
      continue;
    }

    if (trimmed.startsWith('//')) {
      // If props already exist, this comment starts a new block
      if (curProps.length > 0) {
        result.push(...curHeader);
        result.push(...sortProperties(curProps));
        result.push('');
        curHeader = [];
        curProps = [];
      }
      curHeader.push(line);
      i++;
      continue;
    }

    // Property line
    curProps.push(line);
    i++;
  }

  // Flush remaining comment block
  if (curHeader.length > 0 || curProps.length > 0) {
    result.push(...curHeader);
    result.push(...sortProperties(curProps));
    result.push('');
  }

  // Process remaining object blocks with generic rule
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '}' || trimmed === '},') {
      result.push(line);
      i++;
      break;
    }

    if (/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:\s*\{$/.test(trimmed)) {
      const objResult = processObject(lines, i);
      result.push(...objResult.lines);
      i = objResult.idx;
    } else {
      result.push(line);
      i++;
    }
  }

  return { lines: result, idx: i };
}

/** Sort flat property lines by key. */
function sortProperties(propLines: string[]): string[] {
  interface Entry {
    key: string;
    lines: string[];
  }
  const entries: Entry[] = [];
  let cur: string[] = [];

  for (const line of propLines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;

    const m = trimmed.match(/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:/);
    if (m && cur.length > 0) {
      const km = cur[0].trim().match(/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:/);
      entries.push({ key: km?.[1] || '', lines: cur });
      cur = [line];
    } else {
      cur.push(line);
    }
  }

  if (cur.length > 0) {
    const km = cur[0].trim().match(/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:/);
    entries.push({ key: km?.[1] || '', lines: cur });
  }

  entries.sort((a, b) => a.key.localeCompare(b.key));
  return entries.flatMap((e) => e.lines);
}

/**
 * Generic object sorting rule:
 * - Leaf properties are sorted A-Z and placed first.
 * - Object properties keep their original order and are placed after leaves.
 * - Recursively applied to every nested object.
 */
function processObject(lines: string[], startIdx: number) {
  const result: string[] = [];
  let i = startIdx;

  result.push(lines[i]); // key: { or {
  i++;

  const leaves: { key: string; lines: string[] }[] = [];
  const objects: { lines: string[] }[] = [];
  let comments: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '}' || trimmed === '},') {
      leaves.sort((a, b) => a.key.localeCompare(b.key));
      for (const leaf of leaves) result.push(...leaf.lines);
      for (const obj of objects) result.push(...obj.lines);
      result.push(line);
      i++;
      return { lines: result, idx: i };
    }

    if (trimmed.startsWith('//')) {
      comments.push(line);
      i++;
      continue;
    }

    if (trimmed === '') {
      i++;
      continue;
    }

    const m = trimmed.match(/^([a-zA-Z_]\w*|['"][^'"]+['"])\s*:\s*(.*)$/);
    if (m) {
      const key = m[1];
      const rest = m[2];

      if (rest === '{') {
        const nested = processObject(lines, i);
        objects.push({ lines: [...comments, ...nested.lines] });
        comments = [];
        i = nested.idx;
      } else {
        leaves.push({ key, lines: [...comments, line] });
        comments = [];
        i++;
      }
    } else {
      result.push(line);
      i++;
    }
  }

  return { lines: result, idx: i };
}

main();
