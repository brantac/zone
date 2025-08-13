import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TimerService } from '../timer-service'
import { BrowserTimerService } from '../browser-timer-service'

const callback = vi.fn()

describe('BrowserTimerServiceImpl', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should start ticking and call the callback with decreasing remaining time', () => {
    const timerService: TimerService = new BrowserTimerService()
    const initialRemaining = 2 // 2 seconds

    timerService.startTicking(callback, initialRemaining)
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(10)
    expect(callback).toHaveBeenCalledWith(1)
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(20)
    expect(callback).toHaveBeenCalledWith(0)
  })

  it('should stop ticking when stopTicking is called', () => {
    const timerService = new BrowserTimerService()
    const initialRemaining = 2

    timerService.startTicking(callback, initialRemaining)
    timerService.stopTicking()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should reset and resume ticking from paused time', () => {
    const timerService = new BrowserTimerService()
    const initialRemaining = 5

    timerService.startTicking(callback, initialRemaining)
    vi.advanceTimersByTime(2000)

    timerService.stopTicking()
    const pausedTimeRemaining = callback.mock.calls[callback.mock.calls.length - 1][0]

    timerService.startTicking(callback, pausedTimeRemaining)
    vi.advanceTimersByTime(pausedTimeRemaining * 1000)

    expect(callback).toHaveBeenCalledTimes(50)
    expect(callback).toHaveBeenCalledWith(0)
  })

  it('should not allow multiple intervals to run simultaneously', () => {
    const timerService: TimerService = new BrowserTimerService()
    const initialRemaining = 3

    timerService.startTicking(callback, initialRemaining)
    vi.advanceTimersByTime(1000)
    timerService.startTicking(callback, initialRemaining) // Start again without stopping
    vi.advanceTimersByTime(3000)
    expect(callback).toHaveBeenCalledTimes(40)
  })
})
