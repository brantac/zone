import { TimerType, type Timer } from '@/core/entities/timer'
import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import TimerDisplay from '@/components/TimerDisplay.vue'

const displaySelector = '[data-testid="timer-display"]'
let wrapper: VueWrapper

describe('TimerDisplay', () => {
  beforeEach(() => {
    wrapper = mount(TimerDisplay)
  })

  it("should render '00:00' if timer isn't passed", async () => {
    expect(wrapper.find(displaySelector).exists()).toBe(true)
    expect(wrapper.html()).toContain('00:00')
  })

  describe('timer updates', () => {
    let timer: Timer

    beforeEach(() => {
      timer = {
        id: '1',
        type: TimerType.FOCUS,
        duration: 1500,
        remaining: 1500,
        isRunning: true,
      }
    })

    it('should render 25 minutes when 1500 sec remaining', async () => {
      await wrapper.setProps({ timer })

      expect(wrapper.find(displaySelector).exists()).toBe(true)
      expect(wrapper.find(displaySelector).text()).toContain('25:00')
    })

    it('should render 15 minutes when 900 sec remaining', async () => {
      timer.remaining = 900

      await wrapper.setProps({ timer })

      expect(wrapper.find(displaySelector).exists()).toBe(true)
      expect(wrapper.find(displaySelector).text()).toContain('15:00')
    })

    it('should render 14:59 minutes when 859 sec remaining', async () => {
      timer.remaining = 899

      await wrapper.setProps({ timer })

      expect(wrapper.find(displaySelector).exists()).toBe(true)
      expect(wrapper.find(displaySelector).text()).toContain('14:59')
    })

    it('should render 00:05 minutes when 5 sec remaining', async () => {
      timer.remaining = 5

      await wrapper.setProps({ timer })

      expect(wrapper.find(displaySelector).exists()).toBe(true)
      expect(wrapper.find(displaySelector).text()).toContain('00:05')
    })

    it('should render 00:00 minutes when 0 sec remaining', async () => {
      timer.remaining = 0

      await wrapper.setProps({ timer })

      expect(wrapper.find(displaySelector).exists()).toBe(true)
      expect(wrapper.find(displaySelector).text()).toContain('00:00')
    })
  })
})
