<script setup lang="ts">
const hr = useHrStore()

const newCompanyName = ref('')
const showCompanyForm = ref(false)

async function onCreateCompany() {
  const name = newCompanyName.value.trim()
  if (!name) return
  await hr.createCompany(name)
  newCompanyName.value = ''
  showCompanyForm.value = false
}
</script>

<template>
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
</template>
