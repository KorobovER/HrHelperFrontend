<script setup lang="ts">
definePageMeta({
  middleware: ['hr']
})

const auth = useAuthStore()
const hr = useHrStore()
const candidates = useCandidatesStore()

onMounted(() => {
  if (auth.user) {
    hr.fetchProfile(auth.user.id).then(() => {
      if (hr.selectedCompanyId) {
        hr.fetchVacancies(hr.selectedCompanyId)
      }
    })
  }
})

function onLogout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <header class="mb-8 flex items-center justify-between">
        <h1>
          <span class="inline-flex rounded-xl bg-blue-600 px-4 py-2.5">
            <img src="/logo-white.png" alt="STAF.IO" class="h-5 w-auto">
          </span>
        </h1>
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

      <CandidateModal />

      <p v-if="hr.error || candidates.error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {{ hr.error || candidates.error }}
      </p>

      <p v-if="hr.loading" class="text-blue-600">Загрузка…</p>

      <template v-else>
        <HrCompaniesSection />
        <HrVacanciesSection v-if="hr.selectedCompany" class="mb-8" />
        <HrHhImport />
      </template>
    </div>
  </div>
</template>
