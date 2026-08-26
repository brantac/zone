<script setup lang="ts">
import TimerDisplay from './components/TimerDisplay.vue'
import { BrowserTimerService } from './core/services/browser-timer-service'
import { LocalStorageTimerRepository } from './infrastructure/LocalStorageTimerRepository'
import StartTimerBtn from './components/StartTimerBtn.vue'
import { StartSessionUseCaseImpl } from './core/usecases/start-session-usecase-impl'
import { SessionType } from './core/entities/session'
import { useTimerState } from './composables/useTimerState.ts'
const { timer, session } = useTimerState()

const startSessionUseCase = new StartSessionUseCaseImpl(
  new LocalStorageTimerRepository(),
  new BrowserTimerService(),
)
const handleSessionComplete = async () => {
  // Mark session as completed
  session.value.endTime = Date.now()
  session.value.isCompleted = true
}

async function startTimerOnClick(): Promise<void> {
  await startSessionUseCase.execute(SessionType.FOCUS, session, timer, handleSessionComplete)
}
</script>

<template>
  <header class="p-4 flex flex-row justify-center items-center">
    <h1 class="text-2xl font-medium text-neutral-950 dark:text-amber-600">pomo</h1>
  </header>
  <div class="flex flex-col items-center justify-center gap-6 grow">
    <TimerDisplay :timer="timer" class="text-7xl md:text-9xl font-bold text-amber-600" />
    <StartTimerBtn @click="startTimerOnClick">start</StartTimerBtn>
  </div>
</template>

<style scoped></style>
