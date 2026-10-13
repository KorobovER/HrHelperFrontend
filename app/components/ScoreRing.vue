<script setup lang="ts">
const props = withDefaults(defineProps<{
  score: number | null
  size?: number
}>(), { size: 56 })

const color = computed(() => {
  if (props.score === null) return '#93c5fd'
  if (props.score >= 70) return '#22c55e'
  if (props.score >= 40) return '#f59e0b'
  return '#ef4444'
})

const ringBg = computed(() =>
  `conic-gradient(${color.value} ${props.score ?? 0}%, #dbeafe ${props.score ?? 0}%)`
)
</script>

<template>
  <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
    <div class="absolute inset-0 rounded-full" :style="{ background: ringBg }" />
    <div
      class="absolute flex items-center justify-center rounded-full bg-white font-bold"
      :style="{ inset: `${Math.round(size / 7)}px`, color, fontSize: `${Math.max(11, Math.round(size / 3.4))}px` }"
    >
      {{ score ?? '—' }}
    </div>
  </div>
</template>
