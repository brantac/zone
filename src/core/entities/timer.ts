export enum TimerType {
  FOCUS = 'focus',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}

export interface Timer {
  id: string
  duration: number // in seconds
  remaining: number // in seconds
  isRunning: boolean
  type: TimerType
}
