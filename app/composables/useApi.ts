import type { UseFetchOptions } from 'nuxt/app'

const applyAuth = (headers: HeadersInit | undefined): Headers => {
  const result = new Headers(headers)
  // ngrok free tier отдаёт HTML-предупреждение вместо ответа без этого заголовка
  result.set('ngrok-skip-browser-warning', '1')
  const token = useCookie<string | null>('auth_token')
  if (token.value) {
    result.set('Authorization', `Bearer ${token.value}`)
  }
  return result
}

/**
 * Экземпляр $fetch с настроенным baseURL из runtimeConfig.public.apiBase
 * и автоматической подстановкой Bearer-токена.
 * Для клиентских запросов вне SSR-рендеринга (обработчики событий, store'ы).
 */
export const useApi = () => {
  const { public: { apiBase } } = useRuntimeConfig()

  return $fetch.create({
    baseURL: apiBase,
    onRequest({ options }) {
      options.headers = applyAuth(options.headers)
    }
  })
}

/**
 * Обёртка над useFetch с тем же baseURL и Bearer-токеном.
 * Для запросов с поддержкой SSR, кеширования и реактивных данных.
 */
export const useApiFetch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const { public: { apiBase } } = useRuntimeConfig()
  const { onRequest: userOnRequest, ...rest } = options

  return useFetch(url, {
    baseURL: apiBase,
    ...rest,
    onRequest(context) {
      context.options.headers = applyAuth(context.options.headers)
      const hooks = Array.isArray(userOnRequest) ? userOnRequest : userOnRequest ? [userOnRequest] : []
      for (const hook of hooks) {
        hook(context)
      }
    }
  })
}
