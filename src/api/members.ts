import type { Member, NewMember } from '@/schemas/member'
import { memberListSchema, memberSchema } from '@/schemas/member'

// Node's fetch rejects relative URLs and jsdom has no real origin, so resolve every
// path against one. In the browser this is exactly the URL you passed in; under
// vitest it is what lets MSW's Node interceptor see the request at all.
function apiUrl(path: string): string {
  return new URL(path, globalThis.location?.origin ?? 'http://localhost').toString()
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  // Headers rather than an object spread: HeadersInit is also allowed to be an array
  // of pairs or a Headers instance, and spreading either of those silently produces
  // garbage keys. oxlint's no-misused-spread flags exactly this.
  const headers = new Headers(init?.headers)
  headers.set('content-type', 'application/json')

  const response = await fetch(apiUrl(path), { ...init, headers })

  if (!response.ok) {
    // TanStack Query decides retry/error state from a thrown error, so a non-2xx
    // has to throw — `fetch` only rejects on network failure.
    throw new Error(`${init?.method ?? 'GET'} ${path} failed with ${response.status}`)
  }

  return response.status === 204 ? undefined : await response.json()
}

// The network boundary is where unknown JSON becomes a typed Member. Parsing here
// rather than casting means a backend that renames a field fails loudly in one
// place, instead of surfacing as `undefined` three components away.

export async function fetchMembers(options: { simulateError?: boolean } = {}): Promise<Member[]> {
  return memberListSchema.parse(
    await request(`/api/members${options.simulateError ? '?fail=1' : ''}`),
  )
}

export async function createMember(input: NewMember): Promise<Member> {
  return memberSchema.parse(
    await request('/api/members', { method: 'POST', body: JSON.stringify(input) }),
  )
}

export async function deleteMember(id: string): Promise<void> {
  await request(`/api/members/${id}`, { method: 'DELETE' })
}
