import { describe, expect, it, vi } from 'vitest'
import { StartSessionUseCaseImpl } from '@/core/usecases/start-session-usecase-impl'
import { ref } from 'vue'
import { TimerType, type Timer } from '@/core/entities/timer'
import { SessionType, type Session } from '@/core/entities/session'
import { beforeEach } from 'vitest'
import type { StartTimerUseCase } from '../start-timer-usecase'

describe('Session', () => {
  const startTimerUseCase = {
    execute: vi.fn(),
  }

  let startSessionUseCase: StartSessionUseCaseImpl

  beforeEach(() => {
    vi.clearAllMocks()
    startSessionUseCase = new StartSessionUseCaseImpl(startTimerUseCase as StartTimerUseCase)
  })

  it('should create a session and start a timer', async () => {
    // Arrange
    const timerRef = ref<Timer>({
      id: '',
      duration: 1500,
      remaining: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    const sessionRef = ref<Session>({} as Session)

    // Act
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timerRef)

    // Assert
    expect(sessionRef.value).toBeDefined()
    expect(sessionRef.value.id).not.toBe('')
    expect(sessionRef.value.startTime).toBeDefined()
    expect(sessionRef.value.isCompleted).toBe(false)
    expect(sessionRef.value.sessionType).toBe('focus')
    expect(startTimerUseCase.execute).toHaveBeenCalledWith(TimerType.FOCUS, timerRef)
  })
})
