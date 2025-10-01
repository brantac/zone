export enum SessionType {
  FOCUS = 'focus',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}

export interface Session {
  id: string
  startTime: number
  endTime?: number
  isCompleted: boolean
  sessionType: SessionType
}
