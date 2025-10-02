import type { Ref } from 'vue'
import { SessionType, type Session } from '../entities/session'
import { TimerType, type Timer } from '../entities/timer'
import type { StartSessionUseCase } from './start-session-usecase'
import type { TimerRepository } from '../repositories/timer-repository'
import type { TimerService } from '../services/timer-service'

export class StartSessionUseCaseImpl implements StartSessionUseCase {
  constructor(
    private readonly timerRepository: TimerRepository,
    private readonly timerService: TimerService,
  ) {}

  async execute(
    sessionType: SessionType,
    sessionRef: Ref<Session>,
    timerRef: Ref<Timer>,
  ): Promise<void> {
    const newSession: Session = {
      id: generateId(),
      startTime: Date.now(),
      isCompleted: false,
      sessionType,
    }

    sessionRef.value = newSession

    await this.startTimer(this.getTimerType(sessionType), timerRef)
  }

  async startTimer(timerType: TimerType, timerRef: Ref<Timer>): Promise<void> {
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
  }

  private getTimerType(sessionType: SessionType): TimerType {
    switch (sessionType) {
      case SessionType.FOCUS:
        return TimerType.FOCUS
      case SessionType.LONG_BREAK:
        return TimerType.LONG_BREAK
      case SessionType.SHORT_BREAK:
        return TimerType.SHORT_BREAK
    }
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
