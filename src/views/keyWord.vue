<template>
  <div class="search-container">
    <input 
      v-model="searchKeyword" 
      placeholder="输入搜索关键词" 
      class="search-input"
    />
    
    <div class="results-container">
      <div 
        v-for="item in filteredItems" 
        :key="item.id" 
        class="result-item"
      >
        <h3 v-html="highlightText(item.title, searchKeyword)"></h3>
        <div 
          class="content-preview" 
          v-html="highlightContent(item.content, searchKeyword)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchKeyword = ref('');
const items = ref([
  { 
    id: 1, 
    title: 'Vue3入门教程', 
    content: '这是关于Vue3的基础教程，包含组合式API、响应式原理等核心概念。\n适合初学者快速上手Vue3开发。' 
  },
  { 
    id: 2, 
    title: 'Vue3高级特性', 
    content: '深入讲解Vue3的组合式API、Teleport、Suspense等高级特性。\n适合有一定Vue基础的开发者提升技能。' 
  },
  { 
    id: 3, 
    title: 'Vue3与TypeScript', 
    content: '如何在Vue3项目中使用TypeScript进行类型安全开发。\n包含类型推断、组件Props类型定义等实用技巧。' 
  }
]);

const filteredItems = computed(() => {
  if (!searchKeyword.value) return items.value;
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(item => 
    item.title.toLowerCase().includes(keyword) || 
    item.content.toLowerCase().includes(keyword)
  );
});

const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const highlightContent = (content, keyword) => {
  if (!keyword) return content;
  const paragraphs = content.split('\n');
  return paragraphs.map(p => highlightText(p, keyword)).join('<br>');
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.result-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.content-preview {
  margin-top: 8px;
  color: #666;
  line-height: 1.6;
}

.highlight {
  color: red;
  font-weight: bold;
  background-color: rgba(255, 0, 0, 0.1);
}
</style>
