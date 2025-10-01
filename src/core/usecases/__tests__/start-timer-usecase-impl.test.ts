import { beforeEach, describe, expect, it, vi, type MockedClass, type MockedFunction } from 'vitest'
import type { TimerRepository } from '../../repositories/timer-repository'
import type { TimerService } from '../../services/timer-service'
import { TimerType, type Timer } from '../../entities/timer'
import { type StartTimerUseCase } from '../start-timer-usecase'
import { StartTimerUseCaseImpl } from '../start-timer-usecase-impl'
import { afterEach } from 'vitest'
import { ref } from 'vue'

describe('StartTimerUseCase', () => {
  // Arrange

  const mockTimerRepository = {
    getCurrentTimer: vi.fn(),
    saveTimer: vi.fn(),
    updateTimer: vi.fn(),
  }

  const mockTimerService = {
    startTicking: vi.fn(),
    stopTicking: vi.fn(),
  }

  let startTimerUseCase: StartTimerUseCase

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    startTimerUseCase = new StartTimerUseCaseImpl(
      mockTimerRepository as TimerRepository,
      mockTimerService as TimerService,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('timer should stop running if it reaches zero', async () => {
    // Arrange
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    let tickCallback: (remaining: number) => void
    ;(
      mockTimerService.startTicking as MockedFunction<
        (callback: (remaining: number) => void) => void
      >
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startTimerUseCase.execute(TimerType.FOCUS, timer)

    // Assert
    tickCallback!(0)
    expect(mockTimerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 0,
        type: TimerType.FOCUS,
        isRunning: false,
      }),
    )
  })

  it('all dependencies should be called when starting a timer', async () => {
    // Arrange
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    let tickCallback: (remaining: number) => void
    ;(
      mockTimerService.startTicking as MockedFunction<
        (callback: (remaining: number) => void) => void
      >
    ).mockImplementation((callback) => {
      tickCallback = callback
    })

    // Act
    await startTimerUseCase.execute(TimerType.FOCUS, timer)

    // Assert
    expect(mockTimerRepository.getCurrentTimer).toHaveBeenCalled()
    expect(mockTimerRepository.saveTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TimerType.FOCUS,
        remaining: 1500,
        isRunning: true,
      }),
    )
    expect(mockTimerService.startTicking).toHaveBeenCalledWith(expect.any(Function), 1500)

    tickCallback!(1400)
    expect(mockTimerRepository.updateTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        remaining: 1400,
        type: TimerType.FOCUS,
        isRunning: true,
      }),
    )
    expect(timer.value.id).toBeDefined()
    expect(timer.value.remaining).toBe(1400) // 25 minutes in seconds
    expect(timer.value.isRunning).toBe(true)
  })

  it('should stop the current timer if there is one running', async () => {
    // Arrange
    const timer = ref({
      id: '',
      remaining: 1500,
      duration: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    })
    mockTimerRepository.getCurrentTimer.mockResolvedValue({
      id: 'asfasf',
      remaining: 1500,
      duration: 1500,
      isRunning: true,
      type: TimerType.FOCUS,
    })

    // Act
    await startTimerUseCase.execute(TimerType.FOCUS, timer)

    // Assert
    expect(mockTimerService.stopTicking).toHaveBeenCalled()
  })
})
