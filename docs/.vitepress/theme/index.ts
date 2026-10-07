import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import DocTags from './DocTags.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(DocTags) }),
};
