<script setup lang="ts">
const props = defineProps<{ videoId: number }>()

const visible = ref(false)
const loading = ref(false)
const error = ref('')
const blobUrl = ref<string | null>(null)

async function show() {
  visible.value = true
  if (blobUrl.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const $api = useApi()
    const blob = await $api<Blob>(`/candidates/interviews/${props.videoId}/file`, {
      responseType: 'blob'
    })
    blobUrl.value = URL.createObjectURL(blob)
  }
  catch (e: any) {
    error.value = e?.response?.status === 404
      ? 'Файл видео не найден на сервере'
      : 'Не удалось загрузить видео'
  }
  finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
})
</script>

<template>
  <div>
    <button
      v-if="!visible"
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-6 text-sm font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
      @click="show"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.5 5.5v9a1 1 0 0 0 1.53.85l7-4.5a1 1 0 0 0 0-1.7l-7-4.5a1 1 0 0 0-1.53.85Z" />
      </svg>
      Смотреть видео
    </button>

    <div v-else class="overflow-hidden rounded-xl bg-black">
      <div class="flex justify-end bg-black/60 px-2 py-1">
        <button
          type="button"
          class="rounded-md px-2 py-0.5 text-xs font-semibold text-blue-200 transition hover:bg-white/10 hover:text-white"
          @click="visible = false"
        >
          Скрыть видео
        </button>
      </div>
      <div v-if="loading" class="flex items-center justify-center py-10 text-sm text-blue-200">
        Загрузка видео…
      </div>
      <div v-else-if="error" class="flex items-center justify-center py-10 text-sm text-red-300">
        {{ error }}
      </div>
      <video
        v-else-if="blobUrl"
        :src="blobUrl"
        controls
        controlsList="nodownload"
        class="aspect-video w-full"
      />
    </div>
  </div>
</template>
