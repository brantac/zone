import { describe, expect, it } from 'vitest'
import { TimerType, type Timer } from '../timer'

describe('Timer', () => {
  it('should create a focus timer', () => {
    const timer: Timer = {
      id: '1',
      duration: 1500,
      remaining: 1500,
      isRunning: false,
      type: TimerType.FOCUS,
    }

    expect(timer).toBeDefined()
    expect(timer.id).toBe('1')
    expect(timer.duration).toBe(1500)
    expect(timer.remaining).toBe(1500)
    expect(timer.isRunning).toBe(false)
    expect(timer.type).toBe(TimerType.FOCUS)
  })

  it('should create a break timer', () => {
    const timer: Timer = {
      id: '1',
      duration: 300,
      remaining: 300,
      isRunning: false,
      type: TimerType.SHORT_BREAK,
    }

    expect(timer).toBeDefined()
    expect(timer.id).toBe('1')
    expect(timer.duration).toBe(300)
    expect(timer.remaining).toBe(300)
    expect(timer.isRunning).toBe(false)
    expect(timer.type).toBe(TimerType.SHORT_BREAK)
  })
})
