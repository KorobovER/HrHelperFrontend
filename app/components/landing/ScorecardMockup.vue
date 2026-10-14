<script setup lang="ts">
const questions = [
  'Расскажите про ваш релевантный опыт работы?',
  'Почему вы хотите работать у нас?',
  'Опишите сложную рабочую ситуацию и как вы её решили',
]

const videos = [
  { num: 1, question: 'Расскажите про ваш релевантный опыт работы?' },
  { num: 2, question: 'Почему вы хотите работать у нас?' },
]
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-blue-100 bg-white text-left shadow-2xl shadow-blue-600/15">
    <div class="border-b border-blue-100 px-6 pb-3 pt-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h3 class="truncate text-xl font-bold text-blue-900">Анна Смирнова</h3>
          <div class="mt-0.5 text-xs text-blue-500">ID: 42 · 12.10.2026</div>
        </div>
        <span class="shrink-0 px-2 py-1 text-2xl leading-none text-blue-300">×</span>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <span class="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Итог: 92/100</span>
        <span class="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Резюме: 88/100</span>
        <span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Видео: 3</span>
      </div>

      <nav class="mt-3 flex gap-1 rounded-xl bg-blue-50 p-1">
        <span class="flex-1 rounded-lg px-3 py-1.5 text-center text-xs font-semibold text-blue-500">Резюме</span>
        <span class="flex-1 rounded-lg bg-white px-3 py-1.5 text-center text-xs font-semibold text-blue-700 shadow-sm">Интервью</span>
      </nav>
    </div>

    <div class="space-y-5 px-6 py-5">
      <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div class="flex items-center gap-4">
          <ScoreRing :score="92" :size="72" />
          <div class="min-w-0">
            <h4 class="text-sm font-semibold text-blue-900">Итоговая оценка интервью</h4>
            <div class="mt-0.5 text-xs text-blue-500">92/100 · по результатам всех видеоответов</div>
          </div>
        </div>
        <div class="mt-3 rounded-lg bg-white p-3 text-sm leading-relaxed text-blue-900">
          Сильная мотивация и релевантный опыт. Ответы структурированные, темп речи
          уверенный. Рекомендована к очному собеседованию.
        </div>
      </div>

      <div>
        <h4 class="mb-2 text-sm font-semibold text-blue-900">Вопросы интервью</h4>
        <ol class="list-inside list-decimal space-y-1 text-sm text-blue-800">
          <li v-for="q in questions" :key="q">{{ q }}</li>
        </ol>
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="v in videos"
          :key="v.num"
          class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-semibold">Видео #{{ v.num }}</div>
              <div class="mt-1 text-xs font-medium italic text-blue-700">Вопрос: {{ v.question }}</div>
            </div>
            <span class="shrink-0 rounded-lg border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-600">
              Показать
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
