import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TimerRepository } from '../../repositories/timer-repository'
import type { TimerService } from '../../services/timer-service'
import { TimerType, type Timer } from '../../entities/timer'
import { type StartTimerUseCase } from '../start-timer-usecase'
import { StartTimerUseCaseImpl } from '../start-timer-usecase-impl'

describe('StartTimerUseCase', () => {
  // Mock implementations of the TimerRepository and TimerService
  const mockTimerRepository: TimerRepository = {
    getCurrentTimer: vi.fn(),
    saveTimer: vi.fn(),
    updateTimer: vi.fn(),
  }

  const mockTimerService: TimerService = {
    startTicking: vi.fn(),
    stopTicking: vi.fn(),
  }

  let startTimerUseCase: StartTimerUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    startTimerUseCase = new StartTimerUseCaseImpl(mockTimerRepository, mockTimerService)
  })

  it('should start a focus timer', () => {
    const timerReturnedByRepository: Timer = {
      id: '123',
      type: TimerType.FOCUS,
      duration: 1500, // 25 minutes in seconds
      remaining: 1500, // 25 minutes in seconds
      isRunning: true,
    }

    const timer: Timer = startTimerUseCase.execute(TimerType.FOCUS)

    expect(timer).toBeDefined()
    expect(timer.type).toBe(TimerType.FOCUS)
    expect(timer.duration).toBe(1500) // 25 minutes in seconds
    expect(timer.remaining).toBe(1500) // 25 minutes in seconds
    expect(timer.isRunning).toBe(true)
    expect(mockTimerRepository.saveTimer).toHaveBeenCalled()
    expect(mockTimerService.startTicking).toHaveBeenCalled()
  })
})
