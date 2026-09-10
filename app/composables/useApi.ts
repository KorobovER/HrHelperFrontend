import type { UseFetchOptions } from 'nuxt/app'

/**
 * Экземпляр $fetch с настроенным baseURL из runtimeConfig.public.apiBase.
 * Для клиентских запросов вне SSR-рендеринга (обработчики событий, store'ы).
 */
export const useApi = () => {
  const { public: { apiBase } } = useRuntimeConfig()

  return $fetch.create({
    baseURL: apiBase
  })
}

/**
 * Обёртка над useFetch с тем же baseURL.
 * Для запросов с поддержкой SSR, кеширования и реактивных данных.
 */
export const useApiFetch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const { public: { apiBase } } = useRuntimeConfig()

  return useFetch(url, {
    baseURL: apiBase,
    ...options
  })
}
