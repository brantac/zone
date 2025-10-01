import type { Ref } from 'vue'
import { SessionType, type Session } from '../entities/session'
import { TimerType, type Timer } from '../entities/timer'
import type { StartSessionUseCase } from './start-session-usecase'
import type { StartTimerUseCase } from './start-timer-usecase'

export class StartSessionUseCaseImpl implements StartSessionUseCase {
  constructor(private startTimerUseCase: StartTimerUseCase) {}

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

    await this.startTimerUseCase.execute(this.getTimerType(sessionType), timerRef)
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
