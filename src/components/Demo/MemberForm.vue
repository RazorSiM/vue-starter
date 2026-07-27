<script lang="ts" setup>
import { useForm } from '@tanstack/vue-form'

import type { NewMember, Role } from '@/schemas/member'
import { newMemberSchema, roleSchema } from '@/schemas/member'

const { pending = false } = defineProps<{ pending?: boolean }>()
const emit = defineEmits<{ submit: [value: NewMember] }>()

// The form validates and reports; it does not know the API exists. The panel above
// it turns this event into a mutation, so the form stays testable without a server.
const form = useForm({
  defaultValues: { name: '', email: '', role: 'engineer' } as NewMember,
  // zod 4 implements Standard Schema, which TanStack Form v1 consumes directly —
  // no resolver package in between.
  validators: { onChange: newMemberSchema },
  onSubmit: ({ value }) => {
    emit('submit', value)
    form.reset()
  },
})

const roles = roleSchema.options
</script>

<template>
  <form class="space-y-4" @submit.prevent="form.handleSubmit()">
    <div class="grid gap-4 sm:grid-cols-2">
      <form.Field name="name">
        <template #default="{ field }">
          <div class="space-y-1.5">
            <label :for="field.name" class="block text-xs text-gray-500 font-medium font-mono">
              name
            </label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              type="text"
              autocomplete="off"
              placeholder="Ada Lovelace"
              class="w-full border border-gray-200 rounded-lg bg-white px-3 py-2 text-sm transition focus-visible:(outline-2 outline-indigo-500 outline-offset-0) dark:(border-gray-800 bg-gray-950)"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
            />
            <p
              v-if="field.state.meta.isTouched && field.state.meta.errors.length"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ field.state.meta.errors[0]?.message }}
            </p>
          </div>
        </template>
      </form.Field>

      <form.Field name="email">
        <template #default="{ field }">
          <div class="space-y-1.5">
            <label :for="field.name" class="block text-xs text-gray-500 font-medium font-mono">
              email
            </label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              type="text"
              autocomplete="off"
              placeholder="ada@example.com"
              class="w-full border border-gray-200 rounded-lg bg-white px-3 py-2 text-sm transition focus-visible:(outline-2 outline-indigo-500 outline-offset-0) dark:(border-gray-800 bg-gray-950)"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
            />
            <p
              v-if="field.state.meta.isTouched && field.state.meta.errors.length"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ field.state.meta.errors[0]?.message }}
            </p>
          </div>
        </template>
      </form.Field>
    </div>

    <!-- One of three, so it is a radio group — not three toggle buttons with
         aria-pressed, which is what this was and which tells a screen reader "three
         independent switches". RadioGroupRoot gives it role="radiogroup", a single tab
         stop with arrow keys between the options, and Space to select. None of that is
         extra markup here: it is the behaviour the role already promises. -->
    <form.Field name="role">
      <template #default="{ field }">
        <div class="space-y-1.5">
          <!-- A radiogroup is named by aria-labelledby, not by `<label for>` — `for`
               only binds to form controls, and the group itself is a div. -->
          <span
            :id="`${field.name}-label`"
            class="block text-xs text-gray-500 font-medium font-mono"
          >
            role
          </span>
          <RadioGroupRoot
            :model-value="field.state.value"
            :name="field.name"
            :aria-labelledby="`${field.name}-label`"
            orientation="horizontal"
            class="flex flex-wrap gap-2"
            @update:model-value="field.handleChange($event as Role)"
          >
            <RadioGroupItem
              v-for="role in roles"
              :key="role"
              :value="role"
              class="rounded-lg border px-3 py-1.5 text-sm font-mono transition focus-visible:(outline-2 outline-indigo-500 outline-offset-2) data-[state=checked]:(border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300) data-[state=unchecked]:(border-gray-200 text-gray-600 hover:border-gray-300 dark:(border-gray-800 text-gray-400 hover:border-gray-700))"
            >
              {{ role }}
            </RadioGroupItem>
          </RadioGroupRoot>
        </div>
      </template>
    </form.Field>

    <!-- Subscribe re-renders on the slice it selects, so typing in a field does not
         re-render the whole form just to keep the submit button in sync. -->
    <form.Subscribe :selector="(state) => ({ canSubmit: state.canSubmit, isDirty: state.isDirty })">
      <template #default="{ canSubmit, isDirty }">
        <div class="flex items-center gap-3">
          <UiButton type="submit" :disabled="!canSubmit || !isDirty || pending">
            {{ pending ? 'Adding…' : 'Add member' }}
          </UiButton>
          <span v-if="!canSubmit" class="text-xs text-gray-500 font-mono">
            form has validation errors
          </span>
        </div>
      </template>
    </form.Subscribe>
  </form>
</template>
