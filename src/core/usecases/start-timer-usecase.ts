import type { Ref } from 'vue'
import type { Timer, TimerType } from '../entities/timer'

export interface StartTimerUseCase {
  execute: (timerType: TimerType, timerRef: Ref<Timer>) => Promise<Timer>
}
