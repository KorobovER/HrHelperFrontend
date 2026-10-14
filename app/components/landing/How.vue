<script setup lang="ts">
const steps = [
  {
    num: '01',
    title: 'HR создаёт вакансию',
    text: 'За 2 минуты — вручную или импортом из hh.ru — и получает короткую ссылку для кандидатов',
  },
  {
    num: '02',
    title: 'Кандидат записывает видео',
    text: 'За 5 минут отвечает на 3 видеовопроса прямо в браузере, со смартфона',
  },
  {
    num: '03',
    title: 'ИИ выдаёт скоринг',
    text: 'За 1 минуту анализирует ответы и формирует прозрачный скоринг-лист с разбором',
  },
]
</script>

<template>
  <section id="how" class="mx-auto max-w-6xl px-6 py-20">
    <span v-reveal class="inline-block text-sm font-bold uppercase tracking-widest text-blue-500">Решение</span>
    <h2 v-reveal="80" class="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">
      ИИ-платформа первичной видеооценки и скоринга кандидатов
    </h2>
    <div class="mt-12 grid gap-10 sm:grid-cols-3">
      <div v-for="(step, i) in steps" :key="step.num" v-reveal="i * 120" class="relative">
        <div class="text-6xl font-extrabold text-blue-600">{{ step.num }}</div>
        <h3 class="mt-4 text-lg font-bold">{{ step.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-blue-500">{{ step.text }}</p>
      </div>
    </div>
    <div v-reveal="150" class="mx-auto mt-16 max-w-4xl lg:-rotate-1">
      <LandingScorecardMockup />
    </div>
  </section>
</template>
