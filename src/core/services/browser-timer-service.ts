import type { TimerService } from './timer-service'

export class BrowserTimerService implements TimerService {
  private intervalId: number | null = null
  private startTime: number = 0
  private pausedTimeRemaining: number | null = null

  startTicking(callback: (remaining: number) => void, initialRemaining: number): void {
    if (this.intervalId !== null) {
      this.stopTicking()
    }

    const startTimeRemaining =
      this.pausedTimeRemaining !== null ? this.pausedTimeRemaining : initialRemaining
    this.pausedTimeRemaining = null

    this.startTime = Date.now()

    this.intervalId = window.setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      const remaining = Math.max(0, startTimeRemaining - elapsedTime)

      callback(remaining)

      if (remaining <= 0) {
        this.stopTicking()
      }
    }, 100)
  }

  stopTicking(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}
