<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const admin = useAdminStore()
const auth = useAuthStore()

function onLogout() {
  auth.logout()
  navigateTo('/login')
}

onMounted(() => {
  admin.fetchUsers()
})
</script>

<template>
  <div class="mx-auto mt-10 max-w-5xl px-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-blue-700">Управление пользователями</h1>
      <button
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        @click="onLogout"
      >
        Выйти
      </button>
    </div>

    <p v-if="admin.error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      {{ admin.error }}
    </p>

    <div v-if="admin.loading" class="py-8 text-center text-blue-600">Загрузка…</div>

    <div v-else class="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-md">
      <table class="w-full text-left">
        <thead class="bg-blue-50 text-blue-900">
          <tr>
            <th class="px-4 py-3 text-sm font-semibold">ID</th>
            <th class="px-4 py-3 text-sm font-semibold">Email</th>
            <th class="px-4 py-3 text-sm font-semibold">Роль</th>
            <th class="px-4 py-3 text-sm font-semibold">Подписка</th>
            <th class="px-4 py-3 text-sm font-semibold">Действие</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-blue-50 text-sm">
          <tr v-for="u in admin.users" :key="u.user_id" class="hover:bg-blue-50/50">
            <td class="px-4 py-3">{{ u.user_id }}</td>
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3">{{ u.role }}</td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="u.subscribe === 'yes' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ u.subscribe === 'yes' ? 'Активна' : 'Неактивна' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button
                class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                @click="admin.toggleSubscription(u.user_id)"
              >
                {{ u.subscribe === 'yes' ? 'Отключить' : 'Включить' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
