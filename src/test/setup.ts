import { afterAll, afterEach, beforeAll } from 'vitest'

import { resetMembers } from '@/mocks/db'
import { server } from '@/mocks/node'

// The unit tests are served by the same handlers as the browser, so a test cannot
// pass against a mock the app never sees.

// `onUnhandledRequest: 'error'` is deliberate: a request nobody mocked is a bug in
// the test, and failing is more useful than a silent network attempt under jsdom.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// The mock db is module state that survives between tests — one test's POST would
// otherwise change what the next test's GET returns.
afterEach(() => {
  server.resetHandlers()
  resetMembers()
})

afterAll(() => server.close())
