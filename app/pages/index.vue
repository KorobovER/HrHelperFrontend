<script setup lang="ts">
const auth = useAuthStore()

function onLogout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="mx-auto mt-20 max-w-2xl px-6">
    <h1 class="mb-4 text-3xl font-bold text-blue-700">HrHelperFrontend</h1>

    <template v-if="auth.isAuthenticated">
      <p class="mb-2">
        Вы вошли как <b>{{ auth.user?.email }}</b>
      </p>
      <p
        v-if="auth.user?.subscribe === 'no'"
        class="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700"
      >
        Подписка не активна — HR-функционал временно недоступен.
      </p>
      <button
        class="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        @click="onLogout"
      >
        Выйти
      </button>
    </template>

    <NuxtLink v-else to="/login" class="font-semibold text-blue-600 hover:text-blue-700">
      Войти
    </NuxtLink>
  </div>
</template>
