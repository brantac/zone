import type { Timer } from '../entities/timer'

export interface TimerRepository {
  getCurrentTimer(): Timer | null
  saveTimer(timer: Timer): Timer
  updateTimer(timer: Timer): Timer
}
