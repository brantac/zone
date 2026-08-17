import { SessionType, type Session } from '@/core/entities/session'
import { ref, type Ref } from 'vue'

export function createSession(overrides?: Partial<Session>): Ref<Session> {
  return ref<Session>({
    id: '',
    startTime: new Date().getTime(),
    isCompleted: false,
    sessionType: SessionType.SHORT_BREAK,
    ...overrides,
  })
}
