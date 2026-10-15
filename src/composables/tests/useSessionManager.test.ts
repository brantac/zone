import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionManager } from '../useSessionManager'
import type { StartSessionUseCase } from '@/core/usecases/start-session-usecase'
import { SessionType } from '@/core/entities/session'

describe('useSessionManager', () => {
  let startedSessionTypes: SessionType[]
  let completionCallbacks: Array<() => void>

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    startedSessionTypes = []
    completionCallbacks = []
  })

  afterEach(() => {})

  it('should transition from focus to short break', async () => {
    // Arrange
    const startSessionUseCase: StartSessionUseCase = {
      async execute(sessionType, sessionRef, _timerRef, onComplete) {
        startedSessionTypes.push(sessionType)
        sessionRef.value.sessionType = sessionType
        completionCallbacks.push(onComplete)
      },
    }
    const { completedSessions, currentSession, startSession } =
      useSessionManager(startSessionUseCase)

    // Act
    await startSession()
    completionCallbacks[0]!() // Simulate the transition to short break after the focus session completes

    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.SHORT_BREAK)
    expect(completedSessions.length).toBe(1)
    expect(completedSessions[0]).toBe(SessionType.FOCUS)
  })

  it('should transition through a complete cycle', async () => {
    // Arrange
    const startSessionUseCase: StartSessionUseCase = {
      async execute(sessionType, sessionRef, _timerRef, onComplete) {
        startedSessionTypes.push(sessionType)
        sessionRef.value.sessionType = sessionType
        completionCallbacks.push(onComplete)
      },
    }
    const { completedSessions, currentSession, startSession } =
      useSessionManager(startSessionUseCase)

    // Act
    await startSession() // focus
    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.FOCUS)
    expect(completedSessions).toEqual([])

    // Act
    await completionCallbacks[0]!() // focus --> short-break
    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.SHORT_BREAK)
    expect(completedSessions).toEqual([SessionType.FOCUS])

    // Act
    await completionCallbacks[1]!() // short-break --> focus
    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.FOCUS)
    expect(completedSessions).toEqual([SessionType.FOCUS, SessionType.SHORT_BREAK])

    // Act
    await completionCallbacks[2]!() // short-break --> long-break

    // Assert
    expect(currentSession.value.sessionType).toBe(SessionType.LONG_BREAK)
    expect(completedSessions).toEqual([
      SessionType.FOCUS,
      SessionType.SHORT_BREAK,
      SessionType.FOCUS,
    ])
  })
})
