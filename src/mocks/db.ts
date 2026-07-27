import type { Member, NewMember } from '@/schemas/member'

// Module-level and mutable on purpose. The handlers write to it, so a POST really
// does change what the next GET returns — without that, TanStack Query's cache
// invalidation would have nothing to demonstrate. State lives for one page load.

const seed: Member[] = [
  {
    id: 'm-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'engineer',
    commits: 412,
    joinedAt: '2023-03-14',
  },
  {
    id: 'm-2',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'engineer',
    commits: 287,
    joinedAt: '2022-11-02',
  },
  {
    id: 'm-3',
    name: 'Jony Ive',
    email: 'jony@example.com',
    role: 'designer',
    commits: 64,
    joinedAt: '2024-01-20',
  },
  {
    id: 'm-4',
    name: 'Julie Zhuo',
    email: 'julie@example.com',
    role: 'product',
    commits: 38,
    joinedAt: '2024-06-08',
  },
  {
    id: 'm-5',
    name: 'Linus Torvalds',
    email: 'linus@example.com',
    role: 'engineer',
    commits: 1043,
    joinedAt: '2021-08-30',
  },
]

let members: Member[] = structuredClone(seed)
let nextId = seed.length + 1

export function listMembers(): Member[] {
  return members
}

export function addMember(input: NewMember): Member {
  const member: Member = {
    ...input,
    id: `m-${nextId++}`,
    commits: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
  }
  members = [...members, member]
  return member
}

export function removeMember(id: string): boolean {
  const before = members.length
  members = members.filter((member) => member.id !== id)
  return members.length < before
}

// Called from the vitest setup between tests, so one test's POST cannot leak into
// the next test's GET.
export function resetMembers(): void {
  members = structuredClone(seed)
  nextId = seed.length + 1
}
