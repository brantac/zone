import type { Session } from '../entities/session'

export interface SessionRepository {
  getCurrentSession(): Session | null
  saveSession(session: Session): Session
  updateSession(session: Session): Session
}
