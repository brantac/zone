import type { Session } from '@/core/entities/session'
import type { Timer } from '@/core/entities/timer'
import type { Ref } from 'vue'
import { createTimer } from './create-timer'
import { createSession } from './create-session'

type UseTimerStateReturn = {
  timer: Ref<Timer>
  session: Ref<Session>
  resetTimerState: () => void
}

export function useTimerState(): UseTimerStateReturn {
  const timer = createTimer()
  const session = createSession()

  function resetState() {
    timer.value = createTimer().value
    session.value = createSession().value
  }

  return {
    timer,
    session,
    resetTimerState: resetState,
  }
}
