<script setup lang="ts">
const pains = [
  {
    title: 'Сотни шаблонных откликов',
    text: 'Резюме, сгенерированные ChatGPT, не дают понять реального кандидата',
  },
  {
    title: 'До 50 часов на одну вакансию',
    text: 'Столько времени HR тратит на разбор линейной или junior-позиции',
  },
  {
    title: 'Скрининг отнимает дни',
    text: 'Соискатели игнорируют текстовые тесты, а телефонные созвоны растягивают отбор',
  },
]
</script>

<template>
  <section id="problem" class="bg-blue-50 py-20">
    <div class="mx-auto max-w-6xl px-6">
      <span v-reveal class="inline-block text-sm font-bold uppercase tracking-widest text-blue-500">Проблема</span>
      <h2 v-reveal="80" class="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
        Найм превратился в перегрузку рутиной
      </h2>
      <div class="mt-10 grid gap-5 sm:grid-cols-3">
        <div
          v-for="(pain, i) in pains"
          :key="pain.title"
          v-reveal="i * 120"
          class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-blue-600/10"
        >
          <h3 class="text-lg font-bold">{{ pain.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-blue-500">{{ pain.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
