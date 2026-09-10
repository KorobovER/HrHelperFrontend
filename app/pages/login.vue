<script setup lang="ts">
definePageMeta({
  layout: false
})

const auth = useAuthStore()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const notice = ref('')

const isLogin = computed(() => mode.value === 'login')
const isRoot = computed(() => email.value === 'root@root.root')

function switchMode(next: 'login' | 'register') {
  mode.value = next
  error.value = ''
  notice.value = ''
}

async function submit() {
  error.value = ''
  notice.value = ''
  pending.value = true
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value)
      await navigateTo(auth.isAdmin ? '/admin' : auth.isHr ? '/hr' : '/')
    }
    else {
      await auth.register(email.value, password.value)
      notice.value = 'Регистрация успешна. Доступ к HR-функционалу появится после активации подписки администратором.'
      await navigateTo(auth.isAdmin ? '/admin' : auth.isHr ? '/hr' : '/')
    }
  }
  catch (e: any) {
    error.value = e?.data?.detail || e?.data?.message || 'Не удалось выполнить запрос'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-6">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-blue-600/10">
      <h1 class="mb-6 text-center text-3xl font-bold text-blue-700">HR Helper</h1>

      <div class="mb-6 flex gap-2 rounded-xl bg-blue-50 p-1">
        <button
          type="button"
          class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition"
          :class="isLogin ? 'bg-blue-600 text-white' : 'text-blue-500 hover:bg-blue-100'"
          @click="switchMode('login')"
        >
          Вход
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition"
          :class="!isLogin ? 'bg-blue-600 text-white' : 'text-blue-500 hover:bg-blue-100'"
          @click="switchMode('register')"
        >
          Регистрация
        </button>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <label class="flex flex-col gap-1.5 text-sm font-medium text-blue-900">
          Email
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="hr@company.ru"
            class="rounded-lg border border-blue-200 px-3.5 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
          >
        </label>

        <label class="flex flex-col gap-1.5 text-sm font-medium text-blue-900">
          Пароль
          <input
            v-model="password"
            type="password"
            required
            :minlength="isRoot ? undefined : 8"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
            :placeholder="isRoot ? 'Пароль' : 'Минимум 8 символов'"
            class="rounded-lg border border-blue-200 px-3.5 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
          >
        </label>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p v-if="notice" class="text-sm text-blue-700">{{ notice }}</p>

        <button
          type="submit"
          :disabled="pending"
          class="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {{ pending ? 'Подождите…' : isLogin ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </form>
    </div>
  </div>
</template>
