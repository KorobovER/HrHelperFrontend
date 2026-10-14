<script setup lang="ts">
const auth = useAuthStore()

if (auth.isAdmin) {
  await navigateTo('/admin')
}

useHead({ title: 'STAF.IO — умный видеоскрининг кандидатов' })
</script>

<template>
  <div class="min-h-screen bg-white text-blue-900">
    <LandingHeader />
    <LandingHero />
    <LandingProblem />
    <LandingHow />
    <LandingCta />
    <LandingFooter />
  </div>
</template>
