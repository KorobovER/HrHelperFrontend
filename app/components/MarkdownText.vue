<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ text?: string | null }>()

const html = computed(() => {
  if (!props.text) return ''
  const esc = String(props.text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
  return marked.parse(esc) as string
})
</script>

<template>
  <div class="md" v-html="html" />
</template>

<style scoped>
.md :deep(h1),
.md :deep(h2) {
  margin: 0.75rem 0 0.375rem;
  font-size: 1rem;
  font-weight: 700;
}
.md :deep(h3),
.md :deep(h4) {
  margin: 0.625rem 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.md :deep(p) {
  margin: 0.375rem 0;
}
.md :deep(ul),
.md :deep(ol) {
  margin: 0.375rem 0;
  padding-left: 1.25rem;
}
.md :deep(ul) {
  list-style: disc;
}
.md :deep(ol) {
  list-style: decimal;
}
.md :deep(li) {
  margin: 0.125rem 0;
}
.md :deep(strong) {
  font-weight: 600;
}
.md :deep(hr) {
  margin: 0.75rem 0;
  border-color: #dbeafe;
}
.md :deep(code) {
  border-radius: 0.25rem;
  background: #eff6ff;
  padding: 0.1rem 0.3rem;
  font-size: 0.75rem;
}
.md :deep(pre) {
  overflow-x: auto;
}
.md :deep(blockquote) {
  margin: 0.375rem 0;
  border-left: 3px solid #bfdbfe;
  padding-left: 0.75rem;
  color: #1d4ed8;
}
.md :deep(table) {
  margin: 0.375rem 0;
  border-collapse: collapse;
  font-size: 0.75rem;
}
.md :deep(th),
.md :deep(td) {
  border: 1px solid #dbeafe;
  padding: 0.25rem 0.5rem;
  text-align: left;
}
</style>
