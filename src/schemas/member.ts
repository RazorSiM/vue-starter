import { z } from 'zod'

// One schema doing three jobs: it validates the form, parses the API response and
// infers the TypeScript types. A field cannot drift between the three, which is the
// whole reason zod is here rather than a hand-written interface plus a validator.

export const roleSchema = z.enum(['engineer', 'designer', 'product'])

export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  // zod 4 moved the string formats to the top level: `z.email()`, not
  // `z.string().email()` (deprecated).
  email: z.email(),
  role: roleSchema,
  commits: z.number().int().nonnegative(),
  joinedAt: z.iso.date(),
})

export const memberListSchema = z.array(memberSchema)

// What the form collects. `id`, `commits` and `joinedAt` belong to the server, so
// they are absent here — the form cannot submit fields it has no business setting.
export const newMemberSchema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(40, 'At most 40 characters'),
  email: z.email('That does not look like an email address'),
  role: roleSchema,
})

export type Role = z.infer<typeof roleSchema>
export type Member = z.infer<typeof memberSchema>
export type NewMember = z.infer<typeof newMemberSchema>
