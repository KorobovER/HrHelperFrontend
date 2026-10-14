<script setup lang="ts">
const props = defineProps<{ video: any }>()
</script>

<template>
  <div class="space-y-4">
    <CandidateAnalysisBlock :data="video?.video_analysis" />
    <div v-if="video?.evaluation_result" class="rounded-lg border border-blue-100 bg-white p-3">
      <div class="mb-1.5 text-xs font-semibold text-blue-900">Оценка ответа</div>
      <MarkdownText :text="video.evaluation_result" class="text-xs leading-relaxed text-blue-900" />
    </div>
  </div>
</template>
