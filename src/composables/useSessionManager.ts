import { SessionType, type Session } from '@/core/entities/session'
import type { StartSessionUseCase } from '@/core/usecases/start-session-usecase'
import { createSession } from './create-session'
import { createTimer } from './create-timer'
import type { Ref } from 'vue'
import { TimerType, type Timer } from '@/core/entities/timer'

export interface SessionManagerReturn {
  currentTimer: Ref<Timer>
  currentSession: Ref<Session>
  completedSessions: SessionType[]
  startSession: () => Promise<void>
}

export function useSessionManager(startSessionUseCase: StartSessionUseCase): SessionManagerReturn {
  const currentTimer = createTimer({ type: TimerType.FOCUS })
  const currentSession = createSession({ sessionType: SessionType.FOCUS })
  const completedSessions: SessionType[] = []

  const handleSessionComplete = async () => {
    currentSession.value.endTime = Date.now()
    currentSession.value.isCompleted = true
    completedSessions.push(currentSession.value.sessionType)

    await startSession()
  }

  const getNextSessionType = (): SessionType => {
    const completedSessionsCount = completedSessions.length

    if (completedSessionsCount === 0) {
      return SessionType.FOCUS
    } else if (completedSessionsCount > 0 && completedSessionsCount % 4 === 3) {
      return SessionType.LONG_BREAK
    } else if (completedSessionsCount % 4 === 1) {
      return SessionType.SHORT_BREAK
    } else {
      return SessionType.FOCUS
    }
  }

  const startSession = async () => {
    const nextSessionType = getNextSessionType()

    await startSessionUseCase.execute(
      nextSessionType,
      currentSession,
      currentTimer,
      handleSessionComplete,
    )
  }

  return {
    currentTimer,
    currentSession,
    startSession,
    completedSessions,
  }
}
