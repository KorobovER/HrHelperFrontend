<script setup lang="ts">
definePageMeta({
  middleware: ['hr']
})

const auth = useAuthStore()
const hr = useHrStore()

const newCompanyName = ref('')
const newVacancyName = ref('')
const newQuestionByVacancy = ref<Record<number, string>>({})
const showCompanyForm = ref(false)
const showVacancyForm = ref(false)
const expandedVacancyId = ref<number | null>(null)
const copiedVacancyId = ref<number | null>(null)

onMounted(() => {
  if (auth.user) {
    hr.fetchProfile(auth.user.id).then(() => {
      if (hr.selectedCompanyId) {
        hr.fetchVacancies(hr.selectedCompanyId)
      }
    })
  }
})

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

      <p v-if="hr.error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {{ hr.error }}
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
    </div>
  </div>
</template>
