import { afterEach, describe, expect, it, vi, type MockedFunction } from 'vitest'
import { StartSessionUseCaseImpl } from '@/core/usecases/start-session-usecase-impl'
import { ref } from 'vue'
import { TimerType, type Timer } from '@/core/entities/timer'
import { SessionType, type Session } from '@/core/entities/session'
import { beforeEach } from 'vitest'
import type { TimerRepository } from '@/core/repositories/timer-repository'
import type { TimerService } from '@/core/services/timer-service'

describe('StartSessionUseCase', () => {
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
    const timerRef = ref<Timer>({
      id: '',
      duration: 1500,
      remaining: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    const sessionRef = ref<Session>({
      id: '',
      startTime: 0,
      isCompleted: false,
      sessionType: SessionType.FOCUS,
    })

    // Act
    await startSessionUseCase.execute(
      SessionType.FOCUS,
      sessionRef,
      timerRef,
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
    const timerRef = ref<Timer>({
      id: '',
      duration: 1500,
      remaining: 0,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    const sessionRef = ref<Session>({
      id: '',
      startTime: 0,
      isCompleted: false,
      sessionType: SessionType.FOCUS,
    })

    // Act
    await startSessionUseCase.execute(
      SessionType.SHORT_BREAK,
      sessionRef,
      timerRef,
      handleSessionComplete,
    )

    // Assert
    expect(sessionRef.value).toBeDefined()
    expect(sessionRef.value.id).toBeTypeOf('string')
    expect(sessionRef.value.id).not.toBe('')
    expect(sessionRef.value.startTime).toBeGreaterThan(0)
    expect(sessionRef.value.isCompleted).toBe(false)
    expect(sessionRef.value.sessionType).toBe(SessionType.SHORT_BREAK)
  })

  it('should stop the current timer if there is one running', async () => {
    // Arrange
    const handleSessionComplete = vi.fn()
    const sessionRef = ref<Session>({} as Session)
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    timerRepository.getCurrentTimer.mockResolvedValue({
      id: 'asfasf',
      remaining: 1500,
      duration: 1500,
      isRunning: true,
      type: TimerType.FOCUS,
    })

    // Act
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timer, handleSessionComplete)

    // Assert
    expect(timerService.stopTicking).toHaveBeenCalled()
  })

  it('focus session should end when timer reaches zero', async () => {
    // Arrange
    const sessionRef = ref<Session>({} as Session)
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    const handleSessionComplete = vi.fn().mockImplementation(() => {
      sessionRef.value.isCompleted = true
      sessionRef.value.endTime = Date.now()
    })
    let tickCallback: (remaining: number) => void
    ;(
      timerService.startTicking as MockedFunction<(callback: (remaining: number) => void) => void>
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timer, handleSessionComplete)

    // Assert
    tickCallback!(0)
    expect(timerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 0,
        type: TimerType.FOCUS,
        isRunning: false,
      }),
    )
    expect(timer.value).toEqual(
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
