import { TimerType, type Timer } from '@/core/entities/timer'
import { ref, type Ref } from 'vue'

export function createTimer(overrides?: Partial<Timer>): Ref<Timer> {
  return ref<Timer>({
    id: '',
    duration: 1500,
    remaining: 1500,
    isRunning: false,
    type: TimerType.SHORT_BREAK,
    ...overrides,
  })
}
