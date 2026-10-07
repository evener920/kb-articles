#!/usr/bin/env node
// 把仓库根目录 articles/<分类>/*.md（+ 同目录 assets/ 配图）整理进 VitePress 的 docs/ 源，
// 并自动生成 sidebar.ts 与首页 index.md。每次构建前运行，保证内容与 Notion 推送同步。
//
// 关键点：Notion 文章标题/分类常含 %、？、！、，等字符，直接用作 URL 会让 VitePress 的
// 链接归一化抛 URIError。因此 URL 一律用 ASCII slug（标题清理 + 6位稳定 hash），
// 展示标题仍取自 frontmatter 的 title，互不影响。配图文件名同样 sanitize，避免 Vite 报错。
import {
  cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, statSync,
} from 'node:fs';
import { dirname, resolve, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcArticles = resolve(root, 'articles');
const docsDir = resolve(root, 'docs');
const docsArticles = resolve(docsDir, 'articles');
const vpDir = resolve(docsDir, '.vitepress');

rmSync(docsArticles, { recursive: true, force: true });
mkdirSync(docsArticles, { recursive: true });
mkdirSync(vpDir, { recursive: true });

function hash6(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(36).padStart(6, '0').slice(0, 6);
}
function sanitize(s) {
  return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 40) || 'x';
}

const isDir = (p) => statSync(p).isDirectory();
const cats = readdirSync(srcArticles, { withFileTypes: true }).filter((d) => d.isDirectory());

const groups = [];
let total = 0;

for (const cat of cats) {
  const catName = sanitize(cat.name); // URL 安全
  const srcCat = join(srcArticles, cat.name);
  const dstCat = join(docsArticles, catName);
  mkdirSync(dstCat, { recursive: true });
  const dstAssets = join(dstCat, 'assets');
  mkdirSync(dstAssets, { recursive: true });

  const srcAssetsDir = join(srcCat, 'assets');
  const srcImgs = srcAssetsDir && isDir(srcAssetsDir) ? readdirSync(srcAssetsDir) : [];

  const mds = readdirSync(srcCat).filter((f) => f.endsWith('.md'));
  const items = [];

  for (const f of mds) {
    const origTitle = f.replace(/\.md$/, '');
    const slug = `${sanitize(origTitle)}-${hash6(origTitle)}`;
    let raw = readFileSync(join(srcCat, f), 'utf8');

    // 该文章对应的配图（源 assets 里以原标题为前缀），sanitize 后落到 dst/assets
    const renameMap = {};
    for (const img of srcImgs) {
      if (!img.startsWith(origTitle)) continue;
      const ext = extname(img);
      const tail = img.slice(origTitle.length).replace(ext, '').replace(/^[-\s]*/, '') || '1';
      const target = `${slug}-${tail}${ext}`;
      renameMap[img] = target;
      cpSync(join(srcAssetsDir, img), join(dstAssets, target));
    }

    // 重写正文里的配图引用：renameMap 的 key 就是 md 中引用的图片文件名（精确匹配，
    // 不依赖正则），兼容 assets/ 与 ./assets/ 两种写法。
    for (const [orig, target] of Object.entries(renameMap)) {
      raw = raw.split(`](assets/${orig})`).join(`](./assets/${target})`);
      raw = raw.split(`](./assets/${orig})`).join(`](./assets/${target})`);
    }

    writeFileSync(join(dstCat, `${slug}.md`), raw, 'utf8');

    let title = origTitle;
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      const t = fm[1].match(/^title:\s*"?([^"\n]+)"?/m);
      if (t) title = t[1].trim().replace(/^["']|["']$/g, '');
    }
    items.push({ text: title, link: `/articles/${catName}/${slug}` });
  }

  items.sort((a, b) => a.text.localeCompare(b.text, 'zh'));
  if (items.length) {
    groups.push({ text: cat.name, items, collapsed: false });
    total += items.length;
  }
}

writeFileSync(
  resolve(vpDir, 'sidebar.ts'),
  `export const sidebar = ${JSON.stringify(groups, null, 2)};\n`,
  'utf8',
);

let idx = '# 文章库\n\n';
idx += '> 由 Notion 经 Webhook 自动同步至 GitHub，VitePress 渲染为静态站。\n\n';
for (const g of groups) {
  idx += `## ${g.text}\n\n`;
  for (const it of g.items) idx += `- [${it.text}](${it.link})\n`;
  idx += '\n';
}
writeFileSync(resolve(docsDir, 'index.md'), idx, 'utf8');

console.log(`prep done: ${groups.length} 个分类，${total} 篇文章`);
