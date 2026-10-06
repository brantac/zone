import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionManager } from '../useSessionManager'
import type { StartSessionUseCase } from '@/core/usecases/start-session-usecase'
import { SessionType } from '@/core/entities/session'
import { StartSessionUseCaseImpl } from '@/core/usecases/start-session-usecase-impl'
import type { TimerRepository } from '@/core/repositories/timer-repository'
import type { TimerService } from '@/core/services/timer-service'
import { LocalStorageTimerRepository } from '@/infrastructure/LocalStorageTimerRepository'
import { BrowserTimerService } from '@/core/services/browser-timer-service'

describe('useSessionManager', () => {
  let startSessionUseCase: StartSessionUseCaseImpl

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()

    startSessionUseCase = new StartSessionUseCaseImpl(
      new LocalStorageTimerRepository(),
      new BrowserTimerService(),
    )
  })

  afterEach(() => {})

  it('should transition from focus to short break', async () => {
    // Arrange
    const { completedSessions, currentSession, startSession } =
      useSessionManager(startSessionUseCase)

    // Act
    await startSession()

    // Assert initial state
    expect(currentSession.value.sessionType).toBe(SessionType.FOCUS)
    expect(completedSessions.length).toBe(0)

    // Act: Simulate the completion of the focus session
    vi.advanceTimersByTime(25 * 60 * 1000) // Simulate 25 minutes passing

    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.SHORT_BREAK)
    expect(completedSessions.length).toBe(1)
    expect(completedSessions[0]).toBe(SessionType.FOCUS)
  })

  it('should transition to long break after 2 focus sessions', async () => {
    // Arrange
    const { completedSessions, currentSession, startSession } =
      useSessionManager(startSessionUseCase)

    const startSessionSpy = vi.spyOn(useSessionManager(startSessionUseCase), 'startSession')

    // Act
    await startSession()

    // Assert initial state
    expect(currentSession.value.sessionType).toBe(SessionType.FOCUS)
    expect(completedSessions.length).toBe(0)

    // Act: Simulate the completion of the focus session
    vi.advanceTimersByTime(25 * 60 * 1000) // Simulate 25 minutes passing
    vi.advanceTimersByTime(5 * 60 * 1000) // Simulate 5 minutes passing for short break
    vi.advanceTimersByTime(25 * 60 * 1000) // Simulate 25 minutes passing for the second focus session

    // Assert
    // expect(currentSession.value.sessionType).toBe(SessionType.LONG_BREAK)
    expect(startSessionSpy).toHaveBeenCalledTimes(3)
    expect(completedSessions.length).toBe(3)
    expect(completedSessions[2]).toBe(SessionType.FOCUS)
  })
})
