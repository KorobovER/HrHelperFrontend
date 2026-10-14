export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({ class: 'reveal' }),
    mounted(el: HTMLElement, binding: { value?: number }) {
      el.classList.add('reveal')
      const delay = binding.value ?? 0
      const io = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('reveal-visible')
          el.addEventListener('transitionend', () => {
            el.style.transitionDelay = ''
          }, { once: true })
        }
        else {
          el.style.transitionDelay = '0ms'
          el.classList.remove('reveal-visible')
        }
      }, { threshold: 0.15 })
      io.observe(el)
      ;(el as any).__revealIo = io
    },
    unmounted(el: HTMLElement) {
      ;(el as any).__revealIo?.disconnect()
    },
  })
})
