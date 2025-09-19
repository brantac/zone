import { isRef, type Ref } from 'vue'
import { TimerType, type Timer } from '../entities/timer'
import type { TimerRepository } from '../repositories/timer-repository'
import type { TimerService } from '../services/timer-service'
import type { StartTimerUseCase } from './start-timer-usecase'

export class StartTimerUseCaseImpl implements StartTimerUseCase {
  constructor(
    private readonly timerRepository: TimerRepository,
    private readonly timerService: TimerService,
  ) {}

  async execute(timerType: TimerType, timerRef: Ref<Timer>): Promise<Timer> {
    const duration = timerType === TimerType.FOCUS ? 25 * 60 : 5 * 60

    const currentTimer = await this.timerRepository.getCurrentTimer()

    if (currentTimer && currentTimer.isRunning) {
      this.timerService.stopTicking()
    }
    // this.timerService.stopTicking()

    const timer: Timer = {
      id: generateId(),
      type: timerType,
      duration: duration,
      remaining: duration,
      isRunning: true,
    }

    this.timerRepository.saveTimer(timer)

    this.timerService.startTicking((remaining: number) => {
      timer.remaining = remaining

      if (remaining <= 0) {
        timer.isRunning = false
      }

      timerRef.value = { ...timer }

      this.timerRepository.updateTimer(timer)
    }, timer.remaining)

    return timer
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
