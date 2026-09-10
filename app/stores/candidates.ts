interface Candidate {
  [key: string]: any
}

interface CandidateAnalysisTab {
  videos: any[]
  videoAnalysis: any[]
  transcription: any[]
  audioAnalysis: any[]
  loading: boolean
}

export const useCandidatesStore = defineStore('candidates', () => {
  const candidates = ref<Record<number, Candidate[]>>({})
  const counts = ref<Record<number, number>>({})
  const selectedCandidate = ref<Candidate | null>(null)
  const analysis = ref<Record<string, CandidateAnalysisTab>>({})
  const loading = ref<Record<number, boolean>>({})
  const error = ref('')

  function getAnalysisKey(vacancyId: number, candidateId: number) {
    return `${vacancyId}-${candidateId}`
  }

  function ensureAnalysisTab(vacancyId: number, candidateId: number): CandidateAnalysisTab {
    const key = getAnalysisKey(vacancyId, candidateId)
    if (!analysis.value[key]) {
      analysis.value[key] = { videos: [], videoAnalysis: [], transcription: [], audioAnalysis: [], loading: false }
    }
    return analysis.value[key]
  }

  function extractError(e: any, fallback: string) {
    return e?.data?.detail || e?.data?.message || fallback
  }

  async function fetchCandidatesCount(vacancyId: number) {
    try {
      const $api = useApi()
      const res = await $api<{ count: number }>(`/candidates/vacancy/${vacancyId}/count`)
      counts.value = { ...counts.value, [vacancyId]: res.count }
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить количество кандидатов')
    }
  }

  async function fetchAllCandidates(vacancyId: number) {
    loading.value = { ...loading.value, [vacancyId]: true }
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<Candidate[] | { candidates?: Candidate[] }>(`/candidates/vacancy/${vacancyId}/all-candidates`)
      const list = Array.isArray(res) ? res : (res.candidates ?? [])
      candidates.value = { ...candidates.value, [vacancyId]: list }
      counts.value = { ...counts.value, [vacancyId]: list.length }
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить кандидатов')
    }
    finally {
      loading.value = { ...loading.value, [vacancyId]: false }
    }
  }

  async function fetchCandidate(vacancyId: number, candidateId: number) {
    error.value = ''
    selectedCandidate.value = null
    try {
      const $api = useApi()
      const res = await $api<Candidate>(`/candidates/vacancy/${vacancyId}/candidate/${candidateId}`)
      selectedCandidate.value = res
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить данные кандидата')
    }
  }

  async function fetchCandidateVideos(vacancyId: number, candidateId: number) {
    const tab = ensureAnalysisTab(vacancyId, candidateId)
    tab.loading = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<any[]>(`/candidates/vacancy/${vacancyId}/candidate/${candidateId}/video_interviews`)
      tab.videos = Array.isArray(res) ? res : []
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить видеоинтервью')
    }
    finally {
      tab.loading = false
    }
  }

  async function fetchVideoAnalysis(vacancyId: number, candidateId: number) {
    const tab = ensureAnalysisTab(vacancyId, candidateId)
    tab.loading = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<any[]>(`/candidates/vacancy/${vacancyId}/candidate/${candidateId}/video_analysis`)
      tab.videoAnalysis = Array.isArray(res) ? res : []
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить видео-анализ')
    }
    finally {
      tab.loading = false
    }
  }

  async function fetchTranscription(vacancyId: number, candidateId: number) {
    const tab = ensureAnalysisTab(vacancyId, candidateId)
    tab.loading = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<any[]>(`/candidates/vacancy/${vacancyId}/candidate/${candidateId}/transcription`)
      tab.transcription = Array.isArray(res) ? res : []
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить транскрипцию')
    }
    finally {
      tab.loading = false
    }
  }

  async function fetchAudioAnalysis(vacancyId: number, candidateId: number) {
    const tab = ensureAnalysisTab(vacancyId, candidateId)
    tab.loading = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<any[]>(`/candidates/vacancy/${vacancyId}/candidate/${candidateId}/audio_analysis`)
      tab.audioAnalysis = Array.isArray(res) ? res : []
    }
    catch (e: any) {
      error.value = extractError(e, 'Не удалось загрузить аудио-анализ')
    }
    finally {
      tab.loading = false
    }
  }

  return {
    candidates,
    counts,
    selectedCandidate,
    analysis,
    loading,
    error,
    fetchCandidatesCount,
    fetchAllCandidates,
    fetchCandidate,
    fetchCandidateVideos,
    fetchVideoAnalysis,
    fetchTranscription,
    fetchAudioAnalysis
  }
})
