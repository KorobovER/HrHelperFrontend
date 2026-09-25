<script setup lang="ts">
const props = defineProps<{ video: any }>()

const evaluationHtml = computed(() => {
  const t = props.video?.evaluation_result
  if (!t) return ''
  const esc = String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
})
</script>

<template>
  <div class="space-y-4">
    <AnalysisBlock :data="video?.video_analysis" />
    <div v-if="evaluationHtml" class="rounded-lg border border-blue-100 bg-white p-3">
      <div class="mb-1.5 text-xs font-semibold text-blue-900">Оценка ответа</div>
      <div class="text-xs leading-relaxed text-blue-900" v-html="evaluationHtml" />
    </div>
  </div>
</template>
