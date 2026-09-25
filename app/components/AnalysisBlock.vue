<script setup lang="ts">
const props = defineProps<{ data: any }>()

const root = computed(() => props.data?.processed_data || props.data?.raw_data || props.data || {})

const videoEmotions = computed<Record<string, number> | null>(() =>
  root.value?.анализ_видео?.['Результат анализа эмоций']
  ?? root.value?.video_analysis?.['Результат анализа эмоций']
  ?? null
)

const sortedVideoEmotions = computed(() =>
  Object.entries(videoEmotions.value ?? {}).sort((a, b) => Number(b[1]) - Number(a[1]))
)

const maxEmotion = computed(() =>
  Math.max(1, ...Object.values(videoEmotions.value ?? {}).map(Number))
)

const transcription = computed(() =>
  root.value?.транскрипция?.['Результат анализа текста']
  ?? root.value?.transcription?.['Результат анализа текста']
  ?? (root.value?.текст || root.value?.статистика ? root.value : null)
)

interface AudioInterval {
  label: string
  duration: number | null
  start: number | null
  end: number | null
}

const audioIntervals = computed<AudioInterval[]>(() => {
  const a = root.value?.анализ_аудио ?? root.value?.audio_analysis
  const out: AudioInterval[] = []
  const push = (i: any) => {
    if (!i || typeof i !== 'object') return
    const label = i.эмоция ?? i.emotion
    if (label === undefined) return
    const start = i.start ?? i.начало ?? null
    const end = i.end ?? i.конец ?? null
    const duration = i.продолжительность ?? (start != null && end != null ? end - start : null)
    out.push({ label: String(label), duration, start, end })
  }
  if (Array.isArray(a?.интервалы_эмоций)) {
    a.интервалы_эмоций.forEach(push)
  }
  else if (a && typeof a === 'object') {
    Object.values(a).forEach(v => Array.isArray(v) && v.forEach(push))
  }
  if (!out.length && !videoEmotions.value && !transcription.value && root.value && typeof root.value === 'object') {
    Object.values(root.value).forEach(v => Array.isArray(v) && v.forEach(push))
  }
  return out
})

const audioSummaryEntries = computed(() =>
  Object.entries(root.value?.анализ_аудио?.сводка_эмоций ?? {})
)

const fmt = (n: any) => typeof n === 'number' ? +n.toFixed(2) : n

const formatPause = (p: any) => {
  if (p && typeof p === 'object' && (p.начало !== undefined || p.конец !== undefined)) {
    return `${fmt(p.начало)}–${fmt(p.конец)} с (${fmt(p.длительность)} с)`
  }
  return typeof p === 'number' ? `${fmt(p)} с` : JSON.stringify(p)
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="sortedVideoEmotions.length">
      <div class="mb-2 text-xs font-semibold text-blue-900">Эмоции (видео)</div>
      <div class="space-y-1.5">
        <div
          v-for="[name, count] in sortedVideoEmotions"
          :key="name"
          class="flex items-center gap-2 text-xs"
        >
          <span class="w-24 shrink-0 truncate text-blue-800">{{ name }}</span>
          <div class="h-2 flex-1 rounded bg-blue-100">
            <div
              class="h-2 rounded bg-blue-600"
              :style="{ width: `${(Number(count) / maxEmotion) * 100}%` }"
            />
          </div>
          <span class="w-8 shrink-0 text-right text-blue-600">{{ count }}</span>
        </div>
      </div>
    </div>

    <div v-if="audioIntervals.length || audioSummaryEntries.length">
      <div class="mb-2 text-xs font-semibold text-blue-900">Эмоции (аудио)</div>
      <ul v-if="audioIntervals.length" class="list-inside list-disc space-y-0.5 text-xs text-blue-800">
        <li v-for="(iv, i) in audioIntervals" :key="i">
          {{ iv.label }}<template v-if="iv.duration != null"> — {{ fmt(iv.duration) }} с</template>
          <template v-if="iv.start != null && iv.end != null"> ({{ fmt(iv.start) }}–{{ fmt(iv.end) }} с)</template>
        </li>
      </ul>
      <div v-if="audioSummaryEntries.length" class="mt-2 flex flex-wrap gap-1.5">
        <span
          v-for="[name, count] in audioSummaryEntries"
          :key="name"
          class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700"
        >
          {{ name }}: {{ count }}
        </span>
      </div>
    </div>

    <div v-if="transcription">
      <div class="mb-2 text-xs font-semibold text-blue-900">Транскрипция</div>
      <p v-if="transcription.текст" class="rounded-lg bg-white p-2.5 text-xs text-blue-900">
        {{ transcription.текст }}
      </p>
      <div v-if="transcription.статистика" class="mt-2 flex flex-wrap gap-1.5">
        <span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">
          Слов: {{ transcription.статистика.общее_количество_слов }}
        </span>
        <span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">
          Длительность: {{ fmt(transcription.статистика.длительность_аудио) }} с
        </span>
        <span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">
          Темп: {{ fmt(transcription.статистика.темп_речи) }} сл/мин
        </span>
      </div>
      <div v-if="transcription.долгие_слова?.length" class="mt-2">
        <div class="mb-1 text-[11px] font-medium text-blue-700">Долгие слова</div>
        <table class="w-full text-left text-xs text-blue-800">
          <thead>
            <tr class="text-[10px] uppercase text-blue-400">
              <th class="pr-2 font-medium">Слово</th>
              <th class="pr-2 font-medium">Начало</th>
              <th class="pr-2 font-medium">Конец</th>
              <th class="font-medium">Длит.</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(w, i) in transcription.долгие_слова"
              :key="i"
              class="border-t border-blue-50"
            >
              <td class="py-0.5 pr-2">{{ w.слово }}</td>
              <td class="py-0.5 pr-2">{{ fmt(w.начало) }} с</td>
              <td class="py-0.5 pr-2">{{ fmt(w.конец) }} с</td>
              <td class="py-0.5">{{ fmt(w.длительность) }} с</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="transcription.найденные_паузы?.length" class="mt-2">
        <div class="mb-1 text-[11px] font-medium text-blue-700">Паузы</div>
        <ul class="list-inside list-disc space-y-0.5 text-xs text-blue-800">
          <li v-for="(p, i) in transcription.найденные_паузы" :key="i">{{ formatPause(p) }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
