<script setup lang="ts">
const props = defineProps<{ data: any }>()

const score = computed(() => {
  const n = Number(props.data?.score)
  return Number.isFinite(n) ? n : null
})

const opening = ref(false)
const openError = ref('')

async function openResume() {
  if (opening.value) return
  opening.value = true
  openError.value = ''
  try {
    const $api = useApi()
    const blob = await $api<Blob>(
      `/candidates/candidate/${props.data.candidate_id}/resume-analysis/file`,
      { responseType: 'blob' }
    )
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
  catch (e: any) {
    openError.value = e?.response?.status === 404
      ? 'Файл резюме не найден на сервере'
      : 'Не удалось открыть резюме'
  }
  finally {
    opening.value = false
  }
}
</script>

<template>
  <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
    <div class="mb-3 flex items-center gap-3">
      <ScoreRing :score="score" :size="56" />
      <div class="min-w-0">
        <h4 class="text-sm font-semibold text-blue-900">Анализ резюме</h4>
        <button
          type="button"
          class="inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-blue-600 underline-offset-2 transition hover:text-blue-800 hover:underline disabled:opacity-50"
          :disabled="opening"
          :title="`Открыть ${data.filename}`"
          @click="openResume"
        >
          <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 2.5A1.5 1.5 0 0 1 5.5 1h5.586a1.5 1.5 0 0 1 1.06.44l3.415 3.414a1.5 1.5 0 0 1 .439 1.06V17.5A1.5 1.5 0 0 1 14.5 19h-9A1.5 1.5 0 0 1 4 17.5v-15Zm7-.086V5.5h2.586L11 2.414Z" />
          </svg>
          <span class="truncate">{{ opening ? 'Открытие…' : data.filename }}</span>
        </button>
        <div v-if="data.created_at" class="text-xs text-blue-400">{{ data.created_at }}</div>
        <div v-if="openError" class="mt-0.5 text-xs text-red-500">{{ openError }}</div>
      </div>
    </div>
    <MarkdownText
      :text="data.analysis"
      class="rounded-lg bg-white p-3 text-sm text-blue-900"
    />
  </div>
</template>
