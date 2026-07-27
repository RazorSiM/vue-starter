import { setupServer } from 'msw/node'

import { handlers } from './handlers'

// Node half of the mock, used by vitest through src/test/setup.ts. Same handlers as
// the browser worker, so a test cannot pass against a mock the app never sees.
export const server = setupServer(...handlers)
