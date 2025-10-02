import { afterEach, describe, expect, it, vi, type MockedFunction } from 'vitest'
import { StartSessionUseCaseImpl } from '@/core/usecases/start-session-usecase-impl'
import { ref } from 'vue'
import { TimerType, type Timer } from '@/core/entities/timer'
import { SessionType, type Session } from '@/core/entities/session'
import { beforeEach } from 'vitest'
import type { TimerRepository } from '@/core/repositories/timer-repository'
import type { TimerService } from '@/core/services/timer-service'

describe('Session', () => {
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
    let tickCallback: (remaining: number) => void
    ;(
      timerService.startTicking as MockedFunction<(callback: (remaining: number) => void) => void>
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timerRef)

    // Assert
    expect(sessionRef.value).toBeDefined()
    expect(sessionRef.value.id).not.toBe('')
    expect(sessionRef.value.startTime).toBeDefined()
    expect(sessionRef.value.isCompleted).toBe(false)
    expect(sessionRef.value.sessionType).toBe(SessionType.FOCUS)

    // Verify timer started
    expect(timerRepository.getCurrentTimer).toHaveBeenCalled()
    expect(timerRepository.saveTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TimerType.FOCUS,
        remaining: 1500,
        isRunning: true,
      }),
    )
    expect(timerService.startTicking).toHaveBeenCalledWith(expect.any(Function), 1500)

    // Simulate timer ticks
    expect(tickCallback!).toBeDefined()
    tickCallback!(1499)
    expect(timerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 1499,
        type: TimerType.FOCUS,
        isRunning: true,
      }),
    )
    expect(timerRef.value.id).toBeDefined()
    expect(timerRef.value.remaining).toBe(1499)
    expect(timerRef.value.isRunning).toBe(true)
  })

  it('should stop the current timer if there is one running', async () => {
    // Arrange
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
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timer)

    // Assert
    expect(timerService.stopTicking).toHaveBeenCalled()
  })

  it('timer should stop running if it reaches zero', async () => {
    // Arrange
    const sessionRef = ref<Session>({} as Session)
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    let tickCallback: (remaining: number) => void
    ;(
      timerService.startTicking as MockedFunction<(callback: (remaining: number) => void) => void>
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startSessionUseCase.execute(SessionType.FOCUS, sessionRef, timer)

    // Assert
    tickCallback!(0)
    expect(timerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 0,
        type: TimerType.FOCUS,
        isRunning: false,
      }),
    )
  })
})
