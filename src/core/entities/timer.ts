export enum TimerType {
  FOCUS = 'focus',
  BREAK = 'break',
}

export interface Timer {
  id: string
  duration: number // in seconds
  remaining: number // in seconds
  isRunning: boolean
  type: TimerType
}
