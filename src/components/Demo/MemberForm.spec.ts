import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import UiButton from '@/components/Ui/Button/index.vue'

import MemberForm from './MemberForm.vue'

// UiButton is auto-imported at build time by unplugin-vue-components; a component
// mounted directly in a test gets no such treatment, so register it explicitly.
function mountForm() {
  return mount(MemberForm, { global: { components: { UiButton } } })
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('memberForm', () => {
  it('rejects an invalid email with the message from the zod schema', async () => {
    const wrapper = mountForm()

    const email = wrapper.find('input#email')
    await email.setValue('not-an-email')
    await email.trigger('blur')
    await flush()

    expect(wrapper.text()).toContain('That does not look like an email address')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('enforces the minimum name length', async () => {
    const wrapper = mountForm()

    const name = wrapper.find('input#name')
    await name.setValue('a')
    await name.trigger('blur')
    await flush()

    expect(wrapper.text()).toContain('At least 2 characters')
  })

  it('emits the parsed values once every field is valid', async () => {
    const wrapper = mountForm()

    await wrapper.find('input#name').setValue('Barbara Liskov')
    await wrapper.find('input#email').setValue('barbara@example.com')
    await flush()

    await wrapper.find('form').trigger('submit')
    await flush()

    // The event carries exactly the form's shape — no id, no commits. Anything the
    // server owns is absent by construction, because the schema does not include it.
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { name: 'Barbara Liskov', email: 'barbara@example.com', role: 'engineer' },
    ])
  })

  it('does not submit an empty form', async () => {
    const wrapper = mountForm()

    await wrapper.find('form').trigger('submit')
    await flush()

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  // The role field is a Reka UI RadioGroup, so these assertions are about the roles and
  // states it exposes rather than about the classes it happens to paint. A regression to
  // the aria-pressed buttons this replaced would fail here.
  it('exposes the role field as a labelled radio group', () => {
    const wrapper = mountForm()

    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('aria-labelledby')).toBe('role-label')
    expect(wrapper.get('#role-label').text()).toBe('role')

    const radios = wrapper.findAll('[role="radio"]')
    expect(radios.map((radio) => radio.text())).toEqual(['engineer', 'designer', 'product'])
    // Exactly one is checked — the invariant aria-pressed toggle buttons cannot state.
    expect(radios.filter((radio) => radio.attributes('aria-checked') === 'true')).toHaveLength(1)
  })

  it('moves the selection with the arrow keys', async () => {
    // `attachTo` matters here and nowhere else in this file: roving focus works by
    // calling .focus() on the next item, and an element outside the document cannot
    // be focused. Mounted detached, the arrow key would silently do nothing.
    const wrapper = mount(MemberForm, {
      attachTo: document.body,
      global: { components: { UiButton } },
    })
    // The roving-focus collection registers on mount, so the group has no items to
    // move between until the microtask queue drains.
    await flush()

    const radios = wrapper.findAll('[role="radio"]')
    await radios[0].trigger('focus')
    await radios[0].trigger('keydown', { key: 'ArrowRight' })
    await flush()

    expect(radios[1].attributes('aria-checked')).toBe('true')
    expect(radios[0].attributes('aria-checked')).toBe('false')

    // Attached mounts are not cleaned up for you — leave document.body as we found it.
    wrapper.unmount()
  })

  it('submits the role picked in the radio group', async () => {
    const wrapper = mountForm()

    await wrapper.find('input#name').setValue('Barbara Liskov')
    await wrapper.find('input#email').setValue('barbara@example.com')
    await flush()

    const designer = wrapper.findAll('[role="radio"]')[1]
    await designer.trigger('click')
    await flush()

    expect(designer.attributes('aria-checked')).toBe('true')

    await wrapper.find('form').trigger('submit')
    await flush()

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { name: 'Barbara Liskov', email: 'barbara@example.com', role: 'designer' },
    ])
  })
})
