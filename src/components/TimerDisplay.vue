<template>
  <div data-testid="timer-display">{{ time }}</div>
</template>
<script setup lang="ts">
import type { Timer } from '@/core/entities/timer'
import { computed } from 'vue'

const props = defineProps<{
  timer?: Timer
}>()

const time = computed(() => {
  if (props.timer) {
    const { remaining } = props.timer // Get remainig time in seconds
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return '00:00'
  }
})
</script>
