import type { Ref } from 'vue'
import type { Session, SessionType } from '../entities/session'
import type { Timer } from '../entities/timer'

export interface StartSessionUseCase {
  execute(
    sessionType: SessionType,
    sessionRef: Ref<Session>,
    timerRef: Ref<Timer>,
    onComplete: () => Promise<void> | void,
  ): Promise<void>
}
