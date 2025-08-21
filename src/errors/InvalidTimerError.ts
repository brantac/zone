export class InvalidTimerError extends Error {
  constructor(message?: string) {
    if (message) super(message)
    else super('Invalid Timer data.')

    this.name = 'InvalidTimerError'
    Object.setPrototypeOf(this, InvalidTimerError.prototype)
  }
}
