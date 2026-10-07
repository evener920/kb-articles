#!/usr/bin/env node
// 把仓库根目录 articles/<分类>/*.md（+ 同目录 assets/ 配图）整理进 VitePress 的 docs/ 源，
// 并自动生成 sidebar.ts、首页（分类卡片）、每个分类的 landing 页、以及 /tags 标签页。
// 每次构建前运行，保证内容与 Notion 推送同步。
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
const tagsDir = resolve(docsDir, 'tags');
const vpDir = resolve(docsDir, '.vitepress');

rmSync(docsArticles, { recursive: true, force: true });
rmSync(tagsDir, { recursive: true, force: true });
mkdirSync(docsArticles, { recursive: true });
mkdirSync(tagsDir, { recursive: true });
mkdirSync(vpDir, { recursive: true });

function hash6(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(36).padStart(6, '0').slice(0, 6);
}
function sanitize(s) {
  return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 40) || 'x';
}
// 标签 slug：优先 ASCII 清理；纯中文等无 ASCII 时退回 hash，保证 URL 安全且唯一
function tagSlug(t) {
  const s = sanitize(t);
  return s && s !== 'x' ? s : `t${hash6(t)}`;
}

const isDir = (p) => statSync(p).isDirectory();
const cats = readdirSync(srcArticles, { withFileTypes: true }).filter((d) => d.isDirectory());

const groups = [];
let total = 0;
const tagMap = new Map(); // slug -> { name, articles: [{text, link}] }

function parseTags(fmBlock) {
  const inline = fmBlock.match(/^tags:\s*\[([^\]]*)\]\s*$/m);
  if (inline) {
    const inner = inline[1].trim();
    if (!inner) return [];
    return inner.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  const ml = fmBlock.match(/^tags:\s*\n((?:[ \t]*-[ \t]*.*\n)+)/m);
  if (ml) {
    return ml[1]
      .split('\n')
      .map((l) => l.replace(/^[ \t]*-[ \t]*/, '').trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return [];
}

for (const cat of cats) {
  const catSlug = sanitize(cat.name); // URL 安全
  const srcCat = join(srcArticles, cat.name);
  const dstCat = join(docsArticles, catSlug);
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
    let tags = [];
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      const t = fm[1].match(/^title:\s*"?([^"\n]+)"?/m);
      if (t) title = t[1].trim().replace(/^["']|["']$/g, '');
      tags = parseTags(fm[1]);
    }
    const link = `/articles/${catSlug}/${slug}`;
    items.push({ text: title, link, tags });

    for (const tag of tags) {
      const s = tagSlug(tag);
      if (!tagMap.has(s)) tagMap.set(s, { name: tag, articles: [] });
      tagMap.get(s).articles.push({ text: title, link, tag: s });
    }
  }

  items.sort((a, b) => a.text.localeCompare(b, 'zh'));
  if (items.length) {
    groups.push({ text: cat.name, slug: catSlug, items, collapsed: false });
    total += items.length;
  }
}

writeFileSync(
  resolve(vpDir, 'sidebar.ts'),
  `export const sidebar = ${JSON.stringify(groups, null, 2)};\n`,
  'utf8',
);

// ---- 首页：分类卡片网格 ----
let idx = '# 文章库\n\n';
idx += '> 由 Notion 经 Webhook 自动同步至 GitHub，VitePress 渲染为静态站。\n\n';
idx += '## 分类\n\n';
idx += '<div class="cat-grid">\n';
for (const g of groups) {
  idx += `  <a class="cat-card" href="/articles/${g.slug}/">\n`;
  idx += `    <div class="cat-name">${g.text}</div>\n`;
  idx += `    <div class="cat-count">${g.items.length} 篇</div>\n`;
  idx += `  </a>\n`;
}
idx += '</div>\n';
writeFileSync(resolve(docsDir, 'index.md'), idx, 'utf8');

// ---- 每个分类的 landing 页 ----
for (const g of groups) {
  let page = `# 分类：${g.text}\n\n`;
  page += `> 共 ${g.items.length} 篇\n\n`;
  for (const it of g.items) page += `- [${it.text}](${it.link})\n`;
  writeFileSync(join(docsArticles, g.slug, 'index.md'), page, 'utf8');
}

// ---- /tags 标签页 ----
const tagEntries = [...tagMap.entries()].sort((a, b) => b[1].articles.length - a[1].articles.length || a[1].name.localeCompare(b[1].name, 'zh'));
if (tagEntries.length) {
  let tIdx = '# 标签\n\n';
  tIdx += '> 点击标签查看该主题下的全部文章。\n\n';
  tIdx += '<div class="tag-cloud">\n';
  for (const [s, v] of tagEntries) {
    tIdx += `  <a class="tag-pill" href="/tags/${s}/">${v.name} <span class="tag-num">${v.articles.length}</span></a>\n`;
  }
  tIdx += '</div>\n';
  writeFileSync(resolve(tagsDir, 'index.md'), tIdx, 'utf8');

  for (const [s, v] of tagEntries) {
    let page = `# 标签：${v.name}\n\n`;
    page += `> 共 ${v.articles.length} 篇\n\n`;
    for (const a of v.articles) page += `- [${a.text}](${a.link})\n`;
    writeFileSync(join(tagsDir, `${s}.md`), page, 'utf8');
  }
} else {
  let tIdx = '# 标签\n\n';
  tIdx += '> 暂无任何标签。在文章 frontmatter 的 `tags:` 字段填入标签（如 `tags: [AI, 教程]`），重新构建后这里会自动出现。\n';
  writeFileSync(resolve(tagsDir, 'index.md'), tIdx, 'utf8');
}

console.log(`prep done: ${groups.length} 个分类，${total} 篇文章，${tagEntries.length} 个标签`);
