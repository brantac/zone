<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TimerDisplay from './components/TimerDisplay.vue'
import { TimerType, type Timer } from './core/entities/timer'
import { StartTimerUseCaseImpl } from './core/usecases/start-timer-usecase-impl'
import { BrowserTimerService } from './core/services/browser-timer-service'
import { LocalStorageTimerRepository } from './infrastructure/LocalStorageTimerRepository'
const timer = ref<Timer>({
  id: '',
  duration: 1500,
  remaining: 1500,
  isRunning: false,
  type: TimerType.FOCUS,
})

const startTimerUseCase = new StartTimerUseCaseImpl(
  new LocalStorageTimerRepository(),
  new BrowserTimerService(),
)

onMounted(async () => {
  timer.value = await startTimerUseCase.execute(TimerType.FOCUS, timer)
})
</script>

<template>
  <header>
    <h1>Zone</h1>
    <p>{{ timer?.remaining }}</p>
    <TimerDisplay :timer="timer" />
  </header>
</template>

<style scoped></style>
