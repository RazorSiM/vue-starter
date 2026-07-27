import { delay, http, HttpResponse } from 'msw'

import { newMemberSchema } from '@/schemas/member'

import { addMember, listMembers, removeMember } from './db'

// Paths are written as `*/api/...` rather than `/api/...` on purpose. A bare
// relative path is resolved against `document.baseURI`, which exists in the browser
// but not under Node — the same handlers serve the app, the unit tests and the e2e
// run, so they have to match in both.

export const handlers = [
  http.get('*/api/members', async ({ request }) => {
    await delay(400)

    // Drives the "simulate a failure" toggle on /demo: one query key away from the
    // happy path, so the error and retry states are reachable without a backend.
    if (new URL(request.url).searchParams.has('fail')) {
      return HttpResponse.json({ message: 'Upstream is having a moment' }, { status: 500 })
    }

    return HttpResponse.json(listMembers())
  }),

  http.post('*/api/members', async ({ request }) => {
    await delay(400)

    // The mock validates its own input with the same schema the form uses. A real
    // backend would too, and it keeps the 422 branch honest rather than decorative.
    const parsed = newMemberSchema.safeParse(await request.json())
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Invalid member', issues: parsed.error.issues },
        { status: 422 },
      )
    }

    return HttpResponse.json(addMember(parsed.data), { status: 201 })
  }),

  http.delete('*/api/members/:id', async ({ params }) => {
    await delay(250)

    if (!removeMember(String(params.id))) {
      return HttpResponse.json({ message: 'No such member' }, { status: 404 })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
