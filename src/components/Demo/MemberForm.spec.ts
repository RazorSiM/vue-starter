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
})
