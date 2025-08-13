import type { Timer } from '@/core/entities/timer'
import type { TimerRepository } from '@/core/repositories/timer-repository'

export class LocalStorageTimerRepository implements TimerRepository {
  getCurrentTimer(): Timer | null {
    throw new Error('Method not implemented.')
  }
  saveTimer(timer: Timer): Timer {
    localStorage.setItem('current_timer', JSON.stringify(timer))
    return timer
  }
  updateTimer(timer: Timer): Timer {
    throw new Error('Method not implemented.')
  }
}
