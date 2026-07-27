import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

// Browser half of the mock. Its Node counterpart (src/mocks/node.ts) serves the
// unit tests from the same handlers.
export const worker = setupWorker(...handlers)
