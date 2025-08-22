import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LocalStorageTimerRepository } from '../LocalStorageTimerRepository'
import { TimerType, type Timer } from '@/core/entities/timer'
import { InvalidTimerError } from '@/errors/InvalidTimerError'

describe('LocalStorageTimerRepository', () => {
  const mockLocalStorage = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    key: vi.fn(),
    length: 0,
  }

  beforeEach(() => {
    // Setup localStorage mock
    global.localStorage = mockLocalStorage
    // Clear mock calls before each test
    vi.clearAllMocks()
  })

  describe('saveTimer', () => {
    it('should save timer to localStorage', () => {
      const repository = new LocalStorageTimerRepository()
      const timer: Timer = {
        id: '1',
        duration: 1500,
        remaining: 1500,
        isRunning: true,
        type: TimerType.FOCUS,
      }

      repository.saveTimer(timer)

      // Verify localStorage.setItem was called with correct parameters
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('current_timer', JSON.stringify(timer))
    })

    it('should handle timer with different data', () => {
      const repository = new LocalStorageTimerRepository()
      const timer = {
        id: '2',
        duration: 1500,
        remaining: 400,
        isRunning: false,
        type: TimerType.BREAK,
      }

      repository.saveTimer(timer)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('current_timer', JSON.stringify(timer))
    })

    it('should throw an error if a Timer property is missing', () => {
      const repository = new LocalStorageTimerRepository()
      const timer: Timer = {
        id: '1',
        duration: 1500,
        remaining: 1500,
        isRunning: true,
      }

      // Verify localStorage.setItem was called with correct parameters
      expect(() => repository.saveTimer(timer)).toThrow(InvalidTimerError)
    })

    it('should throw an error if Timer is undefined', () => {
      const repository = new LocalStorageTimerRepository()

      // Verify localStorage.setItem was called with correct parameters
      expect(() => repository.saveTimer()).toThrow(InvalidTimerError)
    })
  })

  describe('getCurrentTimer', () => {
    it('should retrieve the current timer from localStorage', async () => {
      const timer: Timer = {
        id: '1',
        duration: 1500,
        remaining: 1500,
        isRunning: true,
        type: TimerType.FOCUS,
      }

      mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(timer))

      const storage = new LocalStorageTimerRepository()
      const result = await storage.getCurrentTimer()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('current_timer')
      expect(result).toEqual(timer)
    })

    it('should retrieve null if current_timer doesnt exist', async () => {
      const storage = new LocalStorageTimerRepository()
      const result = await storage.getCurrentTimer()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('current_timer')
      expect(result).toBeNull()
    })
  })
})
