<template>
  <header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
    <span class="inline-flex rounded-xl bg-blue-600 px-4 py-2.5">
      <img src="/logo-white.png" alt="STAF.IO" class="h-5 w-auto">
    </span>
    <nav class="hidden items-center gap-8 text-sm font-medium text-blue-500 sm:flex">
      <a href="#problem" class="transition hover:text-blue-700">Проблема</a>
      <a href="#how" class="transition hover:text-blue-700">Как это работает</a>
    </nav>
    <NuxtLink
      to="/login"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Войти
    </NuxtLink>
  </header>
</template>
