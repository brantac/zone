import type { Timer } from '@/core/entities/timer'
import type { TimerRepository } from '@/core/repositories/timer-repository'
import { InvalidTimerError } from '@/errors/InvalidTimerError'

export class LocalStorageTimerRepository implements TimerRepository {
  getCurrentTimer(): Timer | null {
    throw new Error('Method not implemented.')
  }
  saveTimer(timer: Timer): void {
    if (
      timer === undefined ||
      timer.id === undefined ||
      timer.duration === undefined ||
      timer.remaining == undefined ||
      timer.isRunning === undefined ||
      timer.type === undefined
    ) {
      throw new InvalidTimerError()
    }
    localStorage.setItem('current_timer', JSON.stringify(timer))
  }
  updateTimer(timer: Timer): void {
    throw new Error('Method not implemented.')
  }
}
