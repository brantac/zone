import type { Timer } from '../entities/timer'

export interface TimerRepository {
  getCurrentTimer(): Timer | null
  saveTimer(timer: Timer): void
  updateTimer(timer: Timer): void
}
