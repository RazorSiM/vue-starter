import type { Color, Size } from './types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './index.vue'
import { colorToClasses, sizeToClasses } from './types'

describe('button.vue', () => {
  const getExpectedClasses = (color: Color, size: Size) => {
    const colorClasses = colorToClasses.get(color)?.split(' ') || []
    const sizeClasses = sizeToClasses.get(size)?.split(' ') || []
    return [...colorClasses, ...sizeClasses]
  }

  it('renders correctly with default props', () => {
    const wrapper = mount(Button)
    const expectedClasses = getExpectedClasses('primary', 'md')

    expect(wrapper.classes()).toContain('rounded-md')
    expect(wrapper.classes()).toContain('transition')
    expectedClasses.forEach(cls => expect(wrapper.classes()).toContain(cls))
  })

  it('applies the correct class based on color prop', () => {
    const color = 'secondary'
    const wrapper = mount(Button, { props: { color } })
    const expectedClasses = getExpectedClasses(color, 'md')

    expectedClasses.forEach(cls => expect(wrapper.classes()).toContain(cls))
  })

  it('applies the correct class based on size prop', () => {
    const size = 'lg'
    const wrapper = mount(Button, { props: { size } })
    const expectedClasses = getExpectedClasses('primary', size)

    expectedClasses.forEach(cls => expect(wrapper.classes()).toContain(cls))
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('combines multiple classes correctly', () => {
    const wrapper = mount(Button, {
      props: { color: 'secondary', size: 'lg' },
    })
    const expectedClasses = getExpectedClasses('secondary', 'lg')

    expectedClasses.forEach(cls => expect(wrapper.classes()).toContain(cls))
  })

  it('applies additional classes passed via class prop', () => {
    const additionalClass = 'extra-class'
    const wrapper = mount(Button, {
      props: { class: additionalClass },
    })
    expect(wrapper.classes()).toContain(additionalClass)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
