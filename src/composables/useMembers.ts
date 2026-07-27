import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import { createMember, deleteMember, fetchMembers } from '@/api/members'
import type { NewMember } from '@/schemas/member'

// Every query and mutation for the members resource, in one place. Components get
// data and actions; they never see a query key or a fetch call.

const MEMBERS_KEY = 'members'

export interface UseMembersOptions {
  /** Ask the mock API for a 500 instead of data, to exercise the error branch. */
  simulateError?: MaybeRefOrGetter<boolean>
}

export function useMembers(options: UseMembersOptions = {}) {
  const queryClient = useQueryClient()
  const simulateError = () => toValue(options.simulateError) ?? false

  const query = useQuery({
    // The flag is part of the key, not just the fetcher: flipping it is a different
    // resource as far as the cache is concerned, so both results stay cached and
    // toggling back is instant.
    queryKey: computed(() => [MEMBERS_KEY, { fail: simulateError() }]),
    queryFn: () => fetchMembers({ simulateError: simulateError() }),
    // A starter should show the error state promptly rather than retrying three
    // times behind a spinner. Drop this line to get the sensible production default.
    retry: false,
  })

  // Both mutations invalidate the list rather than patching the cache by hand: the
  // server owns `id`, `commits` and `joinedAt`, so a refetch is the honest answer.
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY] })

  const create = useMutation({ mutationFn: createMember, onSuccess: invalidate })
  const remove = useMutation({ mutationFn: deleteMember, onSuccess: invalidate })

  return {
    members: computed(() => query.data.value ?? []),
    isPending: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,

    addMember: (input: NewMember) => create.mutateAsync(input),
    removeMember: (id: string) => remove.mutateAsync(id),
    isAdding: create.isPending,
    removingId: computed(() => (remove.isPending.value ? remove.variables.value : undefined)),
  }
}
