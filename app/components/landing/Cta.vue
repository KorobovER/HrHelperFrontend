<template>
  <section class="mx-auto max-w-6xl px-6 pb-20">
    <div v-reveal class="rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
      <img src="/logo-white.png" alt="STAF.IO" class="mx-auto h-8 w-auto">
      <h2 class="mt-6 text-3xl font-extrabold sm:text-4xl">Попробуйте бесплатно</h2>
      <p class="mx-auto mt-4 max-w-xl text-blue-100">
        Демо-версия ИИ-скрининга: одна вакансия и до 10 кандидатов — бесплатно.
        Протестируйте на своих вакансиях и примите решение на основе реального результата.
      </p>
      <NuxtLink
        to="/login"
        class="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Получить доступ
      </NuxtLink>
    </div>
  </section>
</template>
