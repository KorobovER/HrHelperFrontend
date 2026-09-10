<script setup lang="ts">
const auth = useAuthStore()

if (auth.isAdmin) {
  await navigateTo('/admin')
}
</script>

<template>
  <div class="mx-auto mt-20 max-w-2xl px-6">
    <h1 class="mb-4 text-3xl font-bold text-blue-700">HrHelperFrontend</h1>
    <NuxtLink
      v-if="!auth.isAuthenticated"
      to="/login"
      class="font-semibold text-blue-600 hover:text-blue-700"
    >
      Войти
    </NuxtLink>
  </div>
</template>
