import { describe, expect, it } from 'vitest'

import { createMember, deleteMember, fetchMembers } from './members'

// These hit MSW, not a stub: the handlers in src/mocks/handlers.ts answer, and the
// zod schemas parse the response. A shape change in either fails here.

describe('members api', () => {
  it('parses the seeded list into typed members', async () => {
    const members = await fetchMembers()

    expect(members).toHaveLength(5)
    expect(members[0]).toMatchObject({ name: 'Ada Lovelace', role: 'engineer' })
  })

  it('creates a member the server owns the generated fields of', async () => {
    const created = await createMember({
      name: 'Barbara Liskov',
      email: 'barbara@example.com',
      role: 'engineer',
    })

    // The form never sends these — the API assigns them, and zod proves they arrived.
    expect(created.id).toMatch(/^m-\d+$/)
    expect(created.commits).toBe(0)
    expect(created.joinedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    await expect(fetchMembers()).resolves.toHaveLength(6)
  })

  it('removes a member', async () => {
    await deleteMember('m-1')

    const names = (await fetchMembers()).map((member) => member.name)
    expect(names).not.toContain('Ada Lovelace')
  })

  it('throws on a 500 so the query lands in its error state', async () => {
    await expect(fetchMembers({ simulateError: true })).rejects.toThrow(/failed with 500/)
  })

  it('surfaces the 422 when the payload fails validation at the API', async () => {
    // The handler runs the same newMemberSchema the form does. Bypassing the form —
    // as any real client eventually will — still gets rejected.
    await expect(createMember({ name: 'x', email: 'nope', role: 'engineer' })).rejects.toThrow(
      /failed with 422/,
    )
  })
})
