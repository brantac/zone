import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StartTimerBtn from '@/components/StartTimerBtn.vue'

const btnSelector = '[data-testid="start-timer-btn"]'
let wrapper: VueWrapper

describe('Start Timer Button', () => {
  beforeEach(() => {
    wrapper = mount(StartTimerBtn)
  })

  it('should create a "start-timer" event when clicked', () => {
    expect(wrapper.find(btnSelector).exists()).toBe(true)

    wrapper.find(btnSelector).trigger('click')

    expect(wrapper.emitted()).toHaveProperty('start-timer')
  })
})
