<script setup>
import { useData } from 'vitepress';
import { computed } from 'vue';

const { frontmatter } = useData();

const tags = computed(() => {
  const t = frontmatter.value?.tags;
  if (Array.isArray(t)) return t;
  return t ? [t] : [];
});

function slug(t) {
  const s = String(t)
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40);
  if (s && s !== 'x') return s;
  let h = 0;
  for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `t${h.toString(36).padStart(6, '0').slice(0, 6)}`;
}
</script>

<template>
  <div v-if="tags.length" class="doc-tags">
    <span class="doc-tags-label">标签</span>
    <a v-for="t in tags" :key="t" class="doc-tag" :href="`/tags/${slug(t)}/`">{{ t }}</a>
  </div>
</template>
