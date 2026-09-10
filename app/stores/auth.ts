interface AuthUser {
  id: number
  email: string
  role: string
  subscribe: 'yes' | 'no'
}

interface AuthResponse {
  status: string
  user_id: number
  email: string
  role: string
  subscribe: 'yes' | 'no'
  access_token: string
  token_type: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token')
  const user = useCookie<AuthUser | null>('auth_user')

  const isAuthenticated = computed(() => Boolean(token.value))

  function applyResponse(res: AuthResponse) {
    token.value = res.access_token
    user.value = {
      id: res.user_id,
      email: res.email,
      role: res.role,
      subscribe: res.subscribe
    }
  }

  async function login(email: string, password: string) {
    const $api = useApi()
    const res = await $api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    applyResponse(res)
  }

  async function register(email: string, password: string) {
    const $api = useApi()
    const res = await $api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password }
    })
    applyResponse(res)
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, register, logout }
})
