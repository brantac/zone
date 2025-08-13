export interface TimerService {
  startTicking(callback: (remaining: number) => void, initialRemaining: number): void
  stopTicking(): void
}
