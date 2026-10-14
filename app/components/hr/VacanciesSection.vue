<script setup lang="ts">
const hr = useHrStore()
const candidates = useCandidatesStore()

const newVacancyName = ref('')
const newQuestionByVacancy = ref<Record<number, string>>({})
const showVacancyForm = ref(false)
const expandedVacancyId = ref<number | null>(null)
const expandedCandidatesVacancyId = ref<number | null>(null)
const copiedVacancyId = ref<number | null>(null)

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

function candidateIdOf(candidate: any) {
  return candidate.id ?? candidate.candidate_id ?? candidate.user_id
}
</script>

<template>
  <section>
    <h2 class="mb-4 text-xl font-semibold text-blue-900">
      Вакансии · {{ hr.selectedCompany?.name }}
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
                  @click="candidates.openCandidate(vacancy.id, candidateIdOf(candidate))"
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
</template>
