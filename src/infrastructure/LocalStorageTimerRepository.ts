import type { Timer } from '@/core/entities/timer'
import type { TimerRepository } from '@/core/repositories/timer-repository'

export class LocalStorageTimerRepository implements TimerRepository {
  getCurrentTimer(): Timer | null {
    throw new Error('Method not implemented.')
  }
  saveTimer(timer: Timer): void {
    localStorage.setItem('current_timer', JSON.stringify(timer))
  }
  updateTimer(timer: Timer): void {
    throw new Error('Method not implemented.')
  }
}
