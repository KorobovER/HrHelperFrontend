<template>
  <div class="rounded-3xl border border-blue-100 bg-blue-50/70 p-4 shadow-2xl shadow-blue-600/15">
    <div class="flex items-center gap-4 px-2 pb-4 pt-1">
      <span class="inline-flex rounded-lg bg-blue-600 px-2.5 py-1.5">
        <img src="/logo-white.png" alt="STAF.IO" class="h-4 w-auto">
      </span>
      <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-blue-100">
        <div class="h-full w-2/5 rounded-full bg-blue-600" />
      </div>
      <div class="flex gap-2">
        <div class="h-5 w-12 rounded-full bg-blue-100" />
        <div class="h-5 w-8 rounded-full bg-blue-100" />
      </div>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2 flex flex-col rounded-2xl bg-white p-5">
        <span class="text-xs font-bold text-blue-600">Вопрос 1</span>
        <p class="mt-2 text-sm font-bold leading-snug text-blue-900">
          Расскажите про ваш релевантный опыт работы?
        </p>
        <span class="mt-auto w-fit rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
          Следующий вопрос
        </span>
      </div>

      <div class="col-span-3 flex flex-col rounded-2xl bg-blue-100/60 p-5">
        <div class="flex flex-1 items-center justify-center py-4">
          <svg viewBox="0 0 64 64" class="h-24 w-24 text-blue-500" fill="currentColor" aria-hidden="true">
            <circle cx="32" cy="21" r="13" />
            <path d="M32 38c-11 0-20 6.6-20 15v3h40v-3c0-8.4-9-15-20-15z" />
          </svg>
        </div>
        <div class="flex items-center gap-3 rounded-full bg-white px-4 py-2">
          <svg viewBox="0 0 10 12" class="h-3 w-3 text-blue-900" fill="currentColor" aria-hidden="true">
            <path d="M0 0l10 6-10 6z" />
          </svg>
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-blue-100">
            <div class="h-full w-1/3 rounded-full bg-blue-600" />
          </div>
          <div class="flex items-end gap-0.5" aria-hidden="true">
            <div class="w-0.5 rounded-full bg-blue-600" style="height: 6px" />
            <div class="w-0.5 rounded-full bg-blue-600" style="height: 12px" />
            <div class="w-0.5 rounded-full bg-blue-600" style="height: 16px" />
            <div class="w-0.5 rounded-full bg-blue-600" style="height: 9px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
