interface UserForAdmin {
  user_id: number
  email: string
  role: string
  subscribe: 'yes' | 'no'
}

interface UsersResponse {
  status: string
  users: UserForAdmin[]
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<UserForAdmin[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchUsers() {
    loading.value = true
    error.value = ''
    try {
      const $api = useApi()
      const res = await $api<UsersResponse>('/database/users_for_admin/')
      users.value = res.users
    }
    catch (e: any) {
      error.value = e?.data?.detail || e?.data?.message || 'Не удалось загрузить пользователей'
    }
    finally {
      loading.value = false
    }
  }

  async function toggleSubscription(userId: number) {
    error.value = ''
    try {
      const $api = useApi()
      await $api(`/database/users/${userId}/toggle-subscription`, { method: 'POST' })
      await fetchUsers()
    }
    catch (e: any) {
      error.value = e?.data?.detail || e?.data?.message || 'Не удалось переключить подписку'
    }
  }

  return { users, loading, error, fetchUsers, toggleSubscription }
})
