import { describe, expect, it } from 'vitest'
import type { Session } from '../session'

describe('Session', () => {
  it('should create a session', () => {
    const startTime = Date.now()
    const endTime = startTime + 1000 * 60 * 25 // 25 minutes later

    const session: Session = {
      id: '1',
      startTime: startTime,
      endTime: endTime,
      isCompleted: false,
      cycles: 1,
    }

    expect(session).toBeDefined()
    expect(session.id).toBe('1')
    expect(session.startTime).toBe(startTime)
    expect(session.endTime).toBe(endTime)
    expect(session.isCompleted).toBe(false)
    expect(session.cycles).toBe(1)
  })
})
