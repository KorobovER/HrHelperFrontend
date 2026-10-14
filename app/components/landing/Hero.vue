<template>
  <section class="mx-auto max-w-6xl px-6 pb-20 pt-14 sm:pt-20">
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div v-reveal class="text-center lg:text-left">
        <span class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
          Сокращаем первичный отбор в 3 раза
        </span>
        <h1 class="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
          Умный видеоскрининг кандидатов
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-blue-500 lg:mx-0">
          Платформа для автоматизации первичной оценки кандидатов по видео
          с применением ИИ. Лучшие кандидаты — до первого очного собеседования.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <NuxtLink
            to="/login"
            class="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Попробовать бесплатно
          </NuxtLink>
          <a
            href="#how"
            class="rounded-xl border border-blue-200 px-7 py-3.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Как это работает
          </a>
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-blue-700 lg:justify-start">
          <span class="rounded-full border border-blue-100 bg-blue-50 px-4 py-2">×3 быстрее</span>
          <span class="rounded-full border border-blue-100 bg-blue-50 px-4 py-2">Короткие видеоответы</span>
          <span class="rounded-full border border-blue-100 bg-blue-50 px-4 py-2">Понятный shortlist</span>
        </div>
      </div>
      <div v-reveal="200" class="float-slow lg:rotate-1">
        <LandingInterviewMockup />
      </div>
    </div>
  </section>
</template>
