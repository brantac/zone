import { afterEach, describe, expect, it, vi, type MockedFunction } from 'vitest'
import { StartSessionUseCaseImpl } from '@/core/usecases/start-session-usecase-impl'
import { ref, type Ref } from 'vue'
import { TimerType, type Timer } from '@/core/entities/timer'
import { SessionType, type Session } from '@/core/entities/session'
import { beforeEach } from 'vitest'
import type { TimerRepository } from '@/core/repositories/timer-repository'
import type { TimerService } from '@/core/services/timer-service'

describe('StartSessionUseCase', () => {
  const createTimer = (overrides?: Partial<Timer>): Timer => {
    return {
      id: '',
      duration: 1500,
      remaining: 1500,
      isRunning: false,
      type: TimerType.SHORT_BREAK,
      ...overrides,
    }
  }
  // const createTimer = (timerType: TimerType = TimerType.SHORT_BREAK) => {
  //   const timer: Timer = {
  //     id: '',
  //     duration: 1500,
  //     remaining: 1500,
  //     isRunning: false,
  //     type: timerType,
  //   }
  //   return timer
  // }
  const createSession = (overrides?: Partial<Session>): Session => {
    return {
      id: '',
      startTime: new Date().getTime(),
      isCompleted: false,
      sessionType: SessionType.SHORT_BREAK,
      ...overrides,
    }
  }
  // const createSession = (sessionType: SessionType = SessionType.SHORT_BREAK) => {
  //   const session: Session = {
  //     id: '',
  //     startTime: new Date().getTime(),
  //     isCompleted: false,
  //     sessionType: sessionType,
  //   }
  //   return session
  // }
  const timerService = {
    startTicking: vi.fn(),
    stopTicking: vi.fn(),
  }

  const timerRepository = {
    getCurrentTimer: vi.fn(),
    saveTimer: vi.fn(),
    updateTimer: vi.fn(),
  }

  let startSessionUseCase: StartSessionUseCaseImpl

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    startSessionUseCase = new StartSessionUseCaseImpl(
      timerRepository as TimerRepository,
      timerService as TimerService,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a focus session with correct duration', async () => {
    // Arrange
    const handleSessionComplete = vi.fn()
    const sessionRef = ref<Session | null>(null)
    const timerRef = ref<Timer | null>(null)
    timerRef.value = createTimer({ type: TimerType.FOCUS })
    sessionRef.value = createSession({ sessionType: SessionType.FOCUS })

    // Act
    await startSessionUseCase.execute(
      SessionType.FOCUS,
      sessionRef as Ref<Session>,
      timerRef as Ref<Timer>,
      handleSessionComplete,
    )

    // Assert
    expect(sessionRef.value).toBeDefined()
    expect(sessionRef.value.id).toBeTypeOf('string')
    expect(sessionRef.value.id).not.toBe('')
    expect(sessionRef.value.startTime).toBeGreaterThan(0)
    expect(sessionRef.value.isCompleted).toBe(false)
    expect(sessionRef.value.sessionType).toBe(SessionType.FOCUS)
  })

  it('should create a short break session with 5 minutes', async () => {
    // Arrange
    const handleSessionComplete = vi.fn()
    const timerRef = ref<Timer | null>(null)
    const sessionRef = ref<Session | null>(null)
    timerRef.value = createTimer()
    sessionRef.value = createSession()

    // Act
    if (sessionRef.value !== null && timerRef.value !== null) {
      await startSessionUseCase.execute(
        SessionType.SHORT_BREAK,
        sessionRef as Ref<Session>,
        timerRef as Ref<Timer>,
        handleSessionComplete,
      )
    }

    // Assert
    expect(sessionRef.value).not.toBeNull()
    expect(sessionRef.value.id).toBeTypeOf('string')
    expect(sessionRef.value.id).not.toBe('')
    expect(sessionRef.value.startTime).toBeGreaterThan(0)
    expect(sessionRef.value.isCompleted).toBe(false)
    expect(sessionRef.value.sessionType).toBe(SessionType.SHORT_BREAK)

    expect(timerRef.value).not.toBeNull()
    expect(timerRef.value.duration).toBe(1500) // 5 minutes in seconds
    expect(timerRef.value.remaining).toBe(1500)
    expect(timerRef.value.isRunning).toBe(false)
    expect(timerRef.value.type).toBe(TimerType.SHORT_BREAK)
  })

  it('should stop the current timer if there is one running', async () => {
    // TO-DO: Use the createTimer and createSession functions
    // Arrange
    const handleSessionComplete = vi.fn()
    const sessionRef = ref<Session | null>(null)
    const timerRef = ref<Timer | null>(null)
    timerRef.value = createTimer()
    sessionRef.value = createSession()
    timerRepository.getCurrentTimer.mockResolvedValue({
      id: 'asfasf',
      remaining: 1500,
      duration: 1500,
      isRunning: true,
      type: TimerType.FOCUS,
    })

    // Act
    await startSessionUseCase.execute(
      SessionType.FOCUS,
      sessionRef as Ref<Session>,
      timerRef as Ref<Timer>,
      handleSessionComplete,
    )

    // Assert
    expect(timerService.stopTicking).toHaveBeenCalled()
  })

  it('focus session should end when timer reaches zero', async () => {
    // Arrange
    const sessionRef = ref<Session | null>(null)
    const timerRef = ref<Timer | null>(null)
    timerRef.value = createTimer({ type: TimerType.FOCUS })
    sessionRef.value = createSession({ sessionType: SessionType.FOCUS })

    const handleSessionComplete = vi.fn().mockImplementation(() => {
      if (sessionRef.value) {
        sessionRef.value.isCompleted = true
        sessionRef.value.endTime = Date.now()
      }
    })
    let tickCallback: (remaining: number) => void
    ;(
      timerService.startTicking as MockedFunction<(callback: (remaining: number) => void) => void>
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startSessionUseCase.execute(
      SessionType.FOCUS,
      sessionRef as Ref<Session>,
      timerRef as Ref<Timer>,
      handleSessionComplete,
    )

    // Assert
    tickCallback!(0)
    expect(timerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 0,
        type: TimerType.FOCUS,
        isRunning: false,
      }),
    )
    expect(timerRef.value).toEqual(
      expect.objectContaining({
        remaining: 0,
        isRunning: false,
      }),
    )
    expect(sessionRef.value).toEqual(
      expect.objectContaining({
        isCompleted: true,
        endTime: expect.any(Number),
      }),
    )
  })
})
