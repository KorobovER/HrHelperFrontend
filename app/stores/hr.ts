interface HrCompany {
  id: number
  name: string
  date: string
}

interface HrVacancy {
  id: number
  name: string
  created_at: string
}

interface HrQuestion {
  id: number
  question: string
}

interface HrProfile {
  user_id: number
  subscribe: 'yes' | 'no'
  created_at: string
  role: string
  companies: HrCompany[]
}

export const useHrStore = defineStore('hr', () => {
  const profile = ref<HrProfile | null>(null)
  const vacancies = ref<HrVacancy[]>([])
  const questionsByVacancy = ref<Record<number, HrQuestion[]>>({})
  const shortLinks = ref<Record<number, string>>({})
  const selectedCompanyId = ref<number | null>(null)
  const loading = ref(false)
  const error = ref('')

  const companies = computed(() => profile.value?.companies ?? [])
  const selectedCompany = computed(() =>
    companies.value.find(c => c.id === selectedCompanyId.value) ?? null
  )

  function extractError(e: any, fallback: string) {
    return e?.data?.detail || e?.data?.message || fallback
  }

  async function fetchProfile(userId: number) {
    loading.value = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<{ status: string, user: HrProfile }>(`/database/users/${userId}`)
      profile.value = res.user
      if (!selectedCompanyId.value && res.user.companies.length) {
        selectedCompanyId.value = res.user.companies[0].id
      }
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить профиль')
    }
    finally {
      loading.value = false
    }
  }

  async function createCompany(name: string) {
    error.value = ''
    try {
      const $api = useApi()
      await $api('/database/companies/', { method: 'POST', body: { name } })
      const auth = useAuthStore()
      if (auth.user) await fetchProfile(auth.user.id)
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось создать компанию')
    }
  }

  async function selectCompany(companyId: number) {
    selectedCompanyId.value = companyId
    await fetchVacancies(companyId)
  }

  async function fetchVacancies(companyId: number) {
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<{ status: string, vacancies: HrVacancy[] }>(
        `/database/companies/${companyId}/vacancies`
      )
      vacancies.value = res.vacancies
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить вакансии')
    }
  }

  async function createVacancy(companyId: number, name: string) {
    error.value = ''
    try {
      const $api = useApi()
      await $api('/database/vacancies/', {
        method: 'POST',
        body: { company_id: companyId, name }
      })
      await fetchVacancies(companyId)
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось создать вакансию')
    }
  }

  async function fetchQuestions(vacancyId: number) {
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<{ status: string, questions: HrQuestion[] }>(
        `/database/vacancies/${vacancyId}/all_questions`
      )
      questionsByVacancy.value = { ...questionsByVacancy.value, [vacancyId]: res.questions }
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить вопросы')
    }
  }

  async function addQuestion(vacancyId: number, question: string) {
    error.value = ''
    try {
      const $api = useApi()
      await $api('/database/questions/', {
        method: 'POST',
        body: { vacancy_id: vacancyId, question }
      })
      await fetchQuestions(vacancyId)
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось добавить вопрос')
    }
  }

  async function generateShortUrl(vacancyId: number) {
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<{ short_url: string }>(
        `/database/generate_short_url/${vacancyId}`
      )
      shortLinks.value = { ...shortLinks.value, [vacancyId]: res.short_url }
      return res.short_url
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось сгенерировать ссылку')
      return ''
    }
  }

  return {
    profile,
    companies,
    vacancies,
    questionsByVacancy,
    shortLinks,
    selectedCompanyId,
    selectedCompany,
    loading,
    error,
    fetchProfile,
    createCompany,
    selectCompany,
    fetchVacancies,
    createVacancy,
    fetchQuestions,
    addQuestion,
    generateShortUrl
  }
})
