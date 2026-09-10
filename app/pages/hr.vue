<script setup lang="ts">
definePageMeta({
  middleware: ['hr']
})

const auth = useAuthStore()
const hr = useHrStore()
const candidates = useCandidatesStore()

const newCompanyName = ref('')
const newVacancyName = ref('')
const newQuestionByVacancy = ref<Record<number, string>>({})
const hhUrl = ref('')
const hhImportPending = ref(false)
const hhImportResult = ref<{ company_name?: string, vacancy_name?: string } | null>(null)
const showCompanyForm = ref(false)
const showVacancyForm = ref(false)
const expandedVacancyId = ref<number | null>(null)
const copiedVacancyId = ref<number | null>(null)
const expandedCandidatesVacancyId = ref<number | null>(null)
const activeAnalysisTab = ref<'videos' | 'videoAnalysis' | 'transcription' | 'audioAnalysis'>('videos')

const analysisTabs = [
  { key: 'videos' as const, label: 'Видеоинтервью' },
  { key: 'videoAnalysis' as const, label: 'Видео-анализ' },
  { key: 'transcription' as const, label: 'Транскрипция' },
  { key: 'audioAnalysis' as const, label: 'Аудио-анализ' }
]

const selectedAnalysis = computed(() => {
  if (!candidates.selectedCandidate) return null
  const vacancyId = candidates.selectedCandidate.vacancy_id
  const candidateId = candidates.selectedCandidate.id
  const key = `${vacancyId}-${candidateId}`
  return candidates.analysis[key] ?? null
})

onMounted(() => {
  if (auth.user) {
    hr.fetchProfile(auth.user.id).then(() => {
      if (hr.selectedCompanyId) {
        hr.fetchVacancies(hr.selectedCompanyId)
      }
    })
  }
})

async function onHhImport() {
  const url = hhUrl.value.trim()
  if (!url) return
  hhImportPending.value = true
  hhImportResult.value = null
  try {
    const res = await hr.importHHVacancy(url)
    if (res) {
      hhUrl.value = ''
      hhImportResult.value = { company_name: res.company_name, vacancy_name: res.vacancy_name }
      if (hr.selectedCompanyId) {
        await hr.fetchVacancies(hr.selectedCompanyId)
      }
    }
  }
  finally {
    hhImportPending.value = false
  }
}

async function onCreateCompany() {
  const name = newCompanyName.value.trim()
  if (!name) return
  await hr.createCompany(name)
  newCompanyName.value = ''
  showCompanyForm.value = false
}

async function onCreateVacancy() {
  const name = newVacancyName.value.trim()
  if (!name || !hr.selectedCompanyId) return
  await hr.createVacancy(hr.selectedCompanyId, name)
  newVacancyName.value = ''
  showVacancyForm.value = false
}

async function toggleQuestions(vacancyId: number) {
  if (expandedVacancyId.value === vacancyId) {
    expandedVacancyId.value = null
    return
  }
  expandedVacancyId.value = vacancyId
  if (!hr.questionsByVacancy[vacancyId]) {
    await hr.fetchQuestions(vacancyId)
  }
}

async function onAddQuestion(vacancyId: number) {
  const question = (newQuestionByVacancy.value[vacancyId] || '').trim()
  if (!question) return
  await hr.addQuestion(vacancyId, question)
  newQuestionByVacancy.value[vacancyId] = ''
}

async function toggleCandidates(vacancyId: number) {
  if (expandedCandidatesVacancyId.value === vacancyId) {
    expandedCandidatesVacancyId.value = null
    return
  }
  expandedCandidatesVacancyId.value = vacancyId
  await candidates.fetchCandidatesCount(vacancyId)
  await candidates.fetchAllCandidates(vacancyId)
}

async function openCandidateDetails(vacancyId: number, candidateId: number) {
  activeAnalysisTab.value = 'videos'
  await candidates.fetchCandidate(vacancyId, candidateId)
  await candidates.fetchCandidateVideos(vacancyId, candidateId)
}

async function switchAnalysisTab(tab: 'videos' | 'videoAnalysis' | 'transcription' | 'audioAnalysis') {
  activeAnalysisTab.value = tab
  if (!candidates.selectedCandidate) return
  const vacancyId = candidates.selectedCandidate.vacancy_id
  const candidateId = candidates.selectedCandidate.id
  switch (tab) {
    case 'videos':
      await candidates.fetchCandidateVideos(vacancyId, candidateId)
      break
    case 'videoAnalysis':
      await candidates.fetchVideoAnalysis(vacancyId, candidateId)
      break
    case 'transcription':
      await candidates.fetchTranscription(vacancyId, candidateId)
      break
    case 'audioAnalysis':
      await candidates.fetchAudioAnalysis(vacancyId, candidateId)
      break
  }
}

function closeCandidateDetails() {
  candidates.selectedCandidate = null
}

async function onGenerateLink(vacancyId: number) {
  const url = await hr.generateShortUrl(vacancyId)
  if (url) {
    await navigator.clipboard.writeText(url)
    copiedVacancyId.value = vacancyId
    setTimeout(() => {
      if (copiedVacancyId.value === vacancyId) copiedVacancyId.value = null
    }, 2000)
  }
}

function onLogout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <header class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-blue-700">HR Helper</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-blue-900">{{ auth.user?.email }}</span>
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            @click="onLogout"
          >
            Выйти
          </button>
        </div>
      </header>

      <!-- Modal candidate details -->
      <div
        v-if="candidates.selectedCandidate"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
        @click.self="closeCandidateDetails"
      >
        <div class="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-blue-900">Карточка кандидата</h3>
            <button
              class="rounded-lg px-2 py-1 text-2xl leading-none text-blue-600 transition hover:bg-blue-50"
              aria-label="Закрыть"
              @click="closeCandidateDetails"
            >
              ×
            </button>
          </div>
          <div class="space-y-5">
            <div>
              <div class="text-2xl font-bold text-blue-900">{{ candidates.selectedCandidate.full_name || 'Без имени' }}</div>
              <div class="mt-1 text-sm text-blue-500">
                ID: {{ candidates.selectedCandidate.id }}
                <template v-if="candidates.selectedCandidate.created_at">· {{ candidates.selectedCandidate.created_at }}</template>
              </div>
            </div>

            <div
              v-if="candidates.selectedCandidate.final_evaluation || candidates.selectedCandidate.final_score !== undefined"
              class="rounded-2xl border border-blue-100 bg-blue-50 p-4"
            >
              <h4 class="mb-2 text-sm font-semibold text-blue-900">Итоговая оценка</h4>
              <div v-if="candidates.selectedCandidate.final_score !== undefined" class="mb-1 text-3xl font-bold text-blue-700">
                {{ candidates.selectedCandidate.final_score }}
              </div>
              <p v-if="candidates.selectedCandidate.final_evaluation" class="text-sm text-blue-800">
                {{ candidates.selectedCandidate.final_evaluation }}
              </p>
            </div>

            <div v-if="candidates.selectedCandidate.questions?.length">
              <h4 class="mb-2 text-sm font-semibold text-blue-900">Вопросы интервью</h4>
              <ol class="list-inside list-decimal space-y-1 text-sm text-blue-800">
                <li v-for="q in candidates.selectedCandidate.questions" :key="q.id">
                  {{ q.question }}
                </li>
              </ol>
            </div>

            <div>
              <h4 class="mb-2 text-sm font-semibold text-blue-900">Анализ видеоинтервью</h4>
              <div class="mb-3 flex flex-wrap gap-2">
                <button
                  v-for="tab in analysisTabs"
                  :key="tab.key"
                  type="button"
                  class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                  :class="activeAnalysisTab === tab.key ? 'bg-blue-600 text-white' : 'border border-blue-200 text-blue-600 hover:bg-blue-50'"
                  @click="switchAnalysisTab(tab.key)"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div v-if="selectedAnalysis?.loading" class="text-sm text-blue-500">Загрузка…</div>
              <template v-else>
                <div v-if="activeAnalysisTab === 'videos'" class="flex flex-col gap-3">
                  <div
                    v-for="(video, idx) in selectedAnalysis?.videos"
                    :key="video.id ?? idx"
                    class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
                  >
                    <div class="font-semibold">Видео #{{ idx + 1 }}</div>
                    <div class="mt-1 text-xs text-blue-500">
                      ID: {{ video.id ?? '-' }}
                      <template v-if="video.created_at">· {{ video.created_at }}</template>
                    </div>
                    <details class="mt-2">
                      <summary class="cursor-pointer text-xs text-blue-700">Детали видео</summary>
                      <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-blue-900">{{ JSON.stringify(video, null, 2) }}</pre>
                    </details>
                  </div>
                  <p v-if="!selectedAnalysis?.videos?.length" class="text-sm text-blue-400">Нет видеоинтервью.</p>
                </div>

                <div v-else-if="activeAnalysisTab === 'videoAnalysis'" class="flex flex-col gap-3">
                  <div
                    v-for="(item, idx) in selectedAnalysis?.videoAnalysis"
                    :key="item.video_id ?? idx"
                    class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
                  >
                    <div class="font-semibold">Анализ видео #{{ idx + 1 }}</div>
                    <div class="mt-1 text-xs text-blue-500">video_id: {{ item.video_id ?? '-' }}</div>
                    <details class="mt-2">
                      <summary class="cursor-pointer text-xs text-blue-700">Детали анализа</summary>
                      <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-blue-900">{{ JSON.stringify(item, null, 2) }}</pre>
                    </details>
                  </div>
                  <p v-if="!selectedAnalysis?.videoAnalysis?.length" class="text-sm text-blue-400">Нет видео-анализа.</p>
                </div>

                <div v-else-if="activeAnalysisTab === 'transcription'" class="flex flex-col gap-3">
                  <div
                    v-for="(item, idx) in selectedAnalysis?.transcription"
                    :key="item.video_id ?? idx"
                    class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
                  >
                    <div class="font-semibold">Транскрипция #{{ idx + 1 }}</div>
                    <div class="mt-1 text-xs text-blue-500">video_id: {{ item.video_id ?? '-' }}</div>
                    <div
                      v-if="typeof item.transcription === 'string'"
                      class="mt-2 max-h-40 overflow-y-auto rounded-lg bg-white p-3 text-sm text-blue-800"
                    >
                      {{ item.transcription }}
                    </div>
                    <details v-else class="mt-2">
                      <summary class="cursor-pointer text-xs text-blue-700">Детали транскрипции</summary>
                      <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-blue-900">{{ JSON.stringify(item.transcription, null, 2) }}</pre>
                    </details>
                  </div>
                  <p v-if="!selectedAnalysis?.transcription?.length" class="text-sm text-blue-400">Нет транскрипций.</p>
                </div>

                <div v-else-if="activeAnalysisTab === 'audioAnalysis'" class="flex flex-col gap-3">
                  <div
                    v-for="(item, idx) in selectedAnalysis?.audioAnalysis"
                    :key="item.video_id ?? idx"
                    class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
                  >
                    <div class="font-semibold">Аудио-анализ #{{ idx + 1 }}</div>
                    <div class="mt-1 text-xs text-blue-500">video_id: {{ item.video_id ?? '-' }}</div>
                    <details class="mt-2">
                      <summary class="cursor-pointer text-xs text-blue-700">Детали аудио-анализа</summary>
                      <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-blue-900">{{ JSON.stringify(item, null, 2) }}</pre>
                    </details>
                  </div>
                  <p v-if="!selectedAnalysis?.audioAnalysis?.length" class="text-sm text-blue-400">Нет аудио-анализа.</p>
                </div>
              </template>
            </div>

            <details class="group rounded-xl border border-blue-100">
              <summary class="cursor-pointer p-3 text-sm font-medium text-blue-700 group-open:rounded-t-xl group-open:bg-blue-50">
                Сырые данные кандидата
              </summary>
              <pre class="whitespace-pre-wrap rounded-b-xl bg-blue-50 p-4 text-xs text-blue-900">{{ JSON.stringify(candidates.selectedCandidate, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <p v-if="hr.error || candidates.error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {{ hr.error || candidates.error }}
      </p>

      <p v-if="hr.loading" class="text-blue-600">Загрузка…</p>

      <template v-else>
        <!-- Компании -->
        <section class="mb-8">
          <h2 class="mb-4 text-xl font-semibold text-blue-900">Мои компании</h2>

          <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="company in hr.companies"
              :key="company.id"
              type="button"
              class="rounded-2xl border p-5 text-left transition"
              :class="company.id === hr.selectedCompanyId
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'border-blue-100 bg-white text-blue-900 hover:border-blue-300 hover:shadow-md'"
              @click="hr.selectCompany(company.id)"
            >
              <div class="font-semibold">{{ company.name }}</div>
              <div class="mt-1 text-xs" :class="company.id === hr.selectedCompanyId ? 'text-blue-100' : 'text-blue-400'">
                ID: {{ company.id }}
                <template v-if="company.date">· {{ company.date }}</template>
              </div>
            </button>

            <button
              type="button"
              class="flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 p-5 text-blue-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              @click="showCompanyForm = true"
            >
              <span class="text-5xl font-light leading-none">+</span>
            </button>
          </div>
          <p v-if="!hr.companies.length" class="mb-4 text-sm text-blue-500">
            У вас пока нет компаний — нажмите «+», чтобы добавить.
          </p>

          <form v-if="showCompanyForm" class="mb-4 flex gap-2" @submit.prevent="onCreateCompany">
            <input
              v-model="newCompanyName"
              type="text"
              placeholder="Название новой компании"
              class="flex-1 rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
            >
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Создать
            </button>
            <button
              type="button"
              class="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
              @click="showCompanyForm = false"
            >
              Отмена
            </button>
          </form>
        </section>

        <!-- Вакансии -->
        <section v-if="hr.selectedCompany">
          <h2 class="mb-4 text-xl font-semibold text-blue-900">
            Вакансии · {{ hr.selectedCompany.name }}
          </h2>

          <div class="mb-4 flex flex-col gap-3">
            <div
              v-for="vacancy in hr.vacancies"
              :key="vacancy.id"
              class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div class="font-semibold text-blue-900">{{ vacancy.name }}</div>
                  <div class="mt-0.5 text-xs text-blue-400">
                    ID: {{ vacancy.id }}
                    <template v-if="vacancy.created_at">· {{ vacancy.created_at }}</template>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    class="rounded-lg border border-blue-600 px-3.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                    @click="toggleQuestions(vacancy.id)"
                  >
                    {{ expandedVacancyId === vacancy.id ? 'Скрыть вопросы' : 'Вопросы' }}
                  </button>
                  <button
                    class="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    @click="onGenerateLink(vacancy.id)"
                  >
                    {{ copiedVacancyId === vacancy.id ? 'Скопировано!' : 'Короткая ссылка' }}
                  </button>
                  <button
                    class="rounded-lg border border-blue-600 px-3.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                    @click="toggleCandidates(vacancy.id)"
                  >
                    {{ expandedCandidatesVacancyId === vacancy.id ? 'Скрыть кандидатов' : 'Кандидаты' }}
                    <span v-if="candidates.counts[vacancy.id] !== undefined" class="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
                      {{ candidates.counts[vacancy.id] }}
                    </span>
                  </button>
                </div>
              </div>

              <div
                v-if="hr.shortLinks[vacancy.id]"
                class="mt-3 rounded-lg bg-blue-50 px-3 py-2 font-mono text-xs text-blue-700 break-all"
              >
                {{ hr.shortLinks[vacancy.id] }}
              </div>

              <div v-if="expandedVacancyId === vacancy.id" class="mt-4 border-t border-blue-50 pt-3">
                <ol
                  v-if="hr.questionsByVacancy[vacancy.id]?.length"
                  class="list-inside list-decimal space-y-1 text-sm text-blue-900"
                >
                  <li v-for="q in hr.questionsByVacancy[vacancy.id]" :key="q.id">
                    {{ q.question }}
                  </li>
                </ol>
                <p v-else class="text-sm text-blue-400">Вопросов пока нет.</p>

                <form class="mt-3 flex gap-2" @submit.prevent="onAddQuestion(vacancy.id)">
                  <input
                    v-model="newQuestionByVacancy[vacancy.id]"
                    type="text"
                    placeholder="Новый вопрос"
                    class="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
                  >
                  <button
                    type="submit"
                    class="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Добавить
                  </button>
                </form>
              </div>

              <div v-if="expandedCandidatesVacancyId === vacancy.id" class="mt-4 border-t border-blue-50 pt-3">
                <p v-if="candidates.loading[vacancy.id]" class="text-sm text-blue-500">Загрузка кандидатов…</p>
                <template v-else>
                  <div
                    v-if="candidates.candidates[vacancy.id]?.length"
                    class="flex flex-col gap-2"
                  >
                    <div
                      v-for="candidate in candidates.candidates[vacancy.id]"
                      :key="candidate.id ?? candidate.candidate_id ?? candidate.user_id ?? JSON.stringify(candidate).slice(0,40)"
                      class="flex items-center justify-between rounded-xl bg-blue-50 p-3"
                    >
                      <div class="min-w-0 text-sm text-blue-900">
                        <div class="truncate font-medium">
                          {{ candidate.full_name ?? 'Кандидат #' + (candidate.id ?? '?') }}
                        </div>
                        <div class="truncate text-xs text-blue-500">
                          ID: {{ candidate.id }}
                          <template v-if="candidate.created_at">· {{ candidate.created_at }}</template>
                        </div>
                      </div>
                      <div v-if="candidate.final_score !== undefined" class="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                        {{ candidate.final_score }}
                      </div>
                      <button
                        class="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                        @click="openCandidateDetails(vacancy.id, candidate.id ?? candidate.candidate_id ?? candidate.user_id)"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-sm text-blue-400">Кандидатов пока нет.</p>
                </template>
              </div>
            </div>

            <button
              type="button"
              class="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-300 p-4 text-blue-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              @click="showVacancyForm = true"
            >
              <span class="text-3xl font-light leading-none">+</span>
              <span class="text-sm font-semibold">Добавить вакансию</span>
            </button>
          </div>
          <p v-if="!hr.vacancies.length" class="mb-4 text-sm text-blue-500">
            В этой компании пока нет вакансий — нажмите «+», чтобы добавить.
          </p>

          <form v-if="showVacancyForm" class="flex gap-2" @submit.prevent="onCreateVacancy">
            <input
              v-model="newVacancyName"
              type="text"
              placeholder="Название новой вакансии"
              class="flex-1 rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
            >
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Добавить вакансию
            </button>
            <button
              type="button"
              class="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
              @click="showVacancyForm = false"
            >
              Отмена
            </button>
          </form>
        </section>

        <!-- Импорт с hh.ru -->
        <section class="mb-8">
          <h2 class="mb-4 text-xl font-semibold text-blue-900">Импорт с hh.ru</h2>

          <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="onHhImport">
            <input
              v-model="hhUrl"
              type="url"
              required
              placeholder="https://hh.ru/vacancy/12345678"
              class="flex-1 rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
            >
            <button
              type="submit"
              :disabled="hhImportPending"
              class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {{ hhImportPending ? 'Импорт…' : 'Импортировать' }}
            </button>
          </form>

          <p
            v-if="hhImportResult"
            class="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700"
          >
            Импортировано: <b>{{ hhImportResult.vacancy_name }}</b> в компанию <b>{{ hhImportResult.company_name }}</b>
          </p>
        </section>
      </template>
    </div>
  </div>
</template>
