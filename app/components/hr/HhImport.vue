<script setup lang="ts">
const hr = useHrStore()

const hhUrl = ref('')
const hhImportPending = ref(false)
const hhImportResult = ref<{ company_name?: string, vacancy_name?: string } | null>(null)

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
</script>

<template>
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
