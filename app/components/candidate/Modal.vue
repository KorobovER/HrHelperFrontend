<script setup lang="ts">
const candidates = useCandidatesStore()

const candidateTab = ref<'resume' | 'videos'>('videos')
const expandedVideoIds = ref<Record<number, boolean>>({})

const candidateTabs = [
  { key: 'resume' as const, label: 'Резюме' },
  { key: 'videos' as const, label: 'Интервью' }
]

const candidate = computed(() => candidates.selectedCandidate)

const selectedAnalysis = computed(() => {
  if (!candidate.value) return null
  const key = `${candidate.value.vacancy_id}-${candidate.value.id}`
  return candidates.analysis[key] ?? null
})

const resumeScore = computed(() => {
  const n = Number(selectedAnalysis.value?.resume?.score)
  return Number.isFinite(n) ? n : null
})

const finalScore = computed(() => {
  const n = Number(candidate.value?.final_score)
  return Number.isFinite(n) ? n : null
})

const videosCount = computed(() => selectedAnalysis.value?.videos?.length ?? 0)

watch(candidate, (c) => {
  if (c) {
    expandedVideoIds.value = {}
    candidateTab.value = 'videos'
  }
})

function toggleVideoCard(id: number) {
  expandedVideoIds.value = { ...expandedVideoIds.value, [id]: !expandedVideoIds.value[id] }
}

function questionForVideo(video: any, idx: number): string {
  const direct = video.question_text ?? video.question
  if (typeof direct === 'string' && direct.trim()) return direct
  const questions: any[] = candidate.value?.questions ?? []
  if (video.question_id) {
    const found = questions.find(q => q.id === video.question_id)
    if (found?.question) return found.question
  }
  return questions[idx]?.question ?? ''
}
</script>

<template>
  <div
    v-if="candidate"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
    @click.self="candidates.closeCandidate()"
  >
    <div class="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="border-b border-blue-100 px-6 pb-3 pt-5">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h3 class="truncate text-xl font-bold text-blue-900">
              {{ candidate.full_name || 'Без имени' }}
            </h3>
            <div class="mt-0.5 text-xs text-blue-500">
              ID: {{ candidate.id }}
              <template v-if="candidate.created_at">· {{ candidate.created_at }}</template>
            </div>
          </div>
          <button
            class="shrink-0 rounded-lg px-2 py-1 text-2xl leading-none text-blue-600 transition hover:bg-blue-50"
            aria-label="Закрыть"
            @click="candidates.closeCandidate()"
          >
            ×
          </button>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-if="candidate.final_score !== undefined"
            class="rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="scoreChipClass(Number(candidate.final_score))"
          >
            Итог: {{ candidate.final_score }}/100
          </span>
          <span
            v-if="resumeScore !== null"
            class="rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="scoreChipClass(resumeScore)"
          >
            Резюме: {{ resumeScore }}/100
          </span>
          <span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
            Видео: {{ videosCount }}
          </span>
        </div>

        <nav class="mt-3 flex gap-1 rounded-xl bg-blue-50 p-1">
          <button
            v-for="tab in candidateTabs"
            :key="tab.key"
            type="button"
            class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="candidateTab === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-500 hover:text-blue-700'"
            @click="candidateTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5">
        <div v-if="candidateTab === 'resume'">
          <CandidateResumeAnalysis
            v-if="selectedAnalysis?.resume"
            :data="selectedAnalysis.resume"
          />
          <p v-else class="py-8 text-center text-sm text-blue-400">
            Анализ резюме ещё не проводился.
          </p>
        </div>

        <div v-else-if="candidateTab === 'videos'" class="space-y-5">
          <div
            v-if="finalScore !== null || candidate.final_evaluation"
            class="rounded-2xl border border-blue-100 bg-blue-50 p-4"
          >
            <div class="flex items-center gap-4">
              <ScoreRing :score="finalScore" :size="72" />
              <div class="min-w-0">
                <h4 class="text-sm font-semibold text-blue-900">Итоговая оценка интервью</h4>
                <div class="mt-0.5 text-xs text-blue-500">
                  <template v-if="finalScore !== null">{{ finalScore }}/100 · </template>по результатам всех видеоответов
                </div>
              </div>
            </div>
            <MarkdownText
              v-if="candidate.final_evaluation"
              :text="candidate.final_evaluation"
              class="mt-3 rounded-lg bg-white p-3 text-sm text-blue-900"
            />
          </div>

          <div v-if="candidate.questions?.length">
            <h4 class="mb-2 text-sm font-semibold text-blue-900">Вопросы интервью</h4>
            <ol class="list-inside list-decimal space-y-1 text-sm text-blue-800">
              <li v-for="q in candidate.questions" :key="q.id">
                {{ q.question }}
              </li>
            </ol>
          </div>

          <div v-if="selectedAnalysis?.loading" class="text-sm text-blue-500">Загрузка…</div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="(video, idx) in selectedAnalysis?.videos"
              :key="video.id ?? idx"
              class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="font-semibold">Видео #{{ idx + 1 }}</div>
                  <div class="mt-1 text-xs text-blue-500">
                    ID: {{ video.id ?? '-' }}
                    <template v-if="video.created_at">· {{ video.created_at }}</template>
                  </div>
                  <div
                    v-if="questionForVideo(video, idx)"
                    class="mt-1 text-xs font-medium italic text-blue-700"
                  >
                    Вопрос: {{ questionForVideo(video, idx) }}
                  </div>
                </div>
                <button
                  type="button"
                  class="shrink-0 rounded-lg border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  @click="toggleVideoCard(video.id ?? idx)"
                >
                  {{ expandedVideoIds[video.id ?? idx] ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
              <template v-if="expandedVideoIds[video.id ?? idx]">
                <div class="mt-2">
                  <CandidateVideoPlayer v-if="video.id" :video-id="video.id" />
                </div>
                <div class="mt-2">
                  <CandidateVideoInterviewDetails :video="video" />
                </div>
                <details class="mt-2">
                  <summary class="cursor-pointer text-xs text-blue-700">Сырые данные (JSON)</summary>
                  <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-blue-900">{{ JSON.stringify(video, null, 2) }}</pre>
                </details>
              </template>
            </div>
            <p v-if="!selectedAnalysis?.videos?.length" class="py-8 text-center text-sm text-blue-400">
              Нет видеоинтервью.
            </p>
          </div>

          <details class="group rounded-xl border border-blue-100">
            <summary class="cursor-pointer p-3 text-sm font-medium text-blue-700 group-open:rounded-t-xl group-open:bg-blue-50">
              Сырые данные кандидата
            </summary>
            <pre class="whitespace-pre-wrap rounded-b-xl bg-blue-50 p-4 text-xs text-blue-900">{{ JSON.stringify(candidate, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>
