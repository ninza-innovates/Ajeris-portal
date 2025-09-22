# API Implementation Guide

This guide shows how to replace mock data with actual API calls using the API client structure we've set up.

## Basic Usage

### 1. Import the hooks

```typescript
import { useOrganizations, useCreateOrganization } from '@/lib/api/hooks'
```

### 2. Replace mock data with API calls

#### Before (with mock data):
```typescript
// components/organizations/organizations-list.tsx
const organizations = [
  { id: '1', name: 'Hospital A', status: 'active' },
  { id: '2', name: 'Hospital B', status: 'active' },
]

export function OrganizationsList() {
  return (
    <div>
      {organizations.map(org => (
        <div key={org.id}>{org.name}</div>
      ))}
    </div>
  )
}
```

#### After (with API):
```typescript
// components/organizations/organizations-list.tsx
import { useOrganizations } from '@/lib/api/hooks'
import { Skeleton } from '@/components/ui/skeleton'

export function OrganizationsList() {
  const { data, isLoading, error } = useOrganizations()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (error) {
    return <div>Error loading organizations: {error.message}</div>
  }

  const organizations = data?.data || []

  return (
    <div>
      {organizations.map(org => (
        <div key={org.id}>{org.name}</div>
      ))}
    </div>
  )
}
```

## Mutations (Create, Update, Delete)

### Example: Creating an organization

```typescript
import { useCreateOrganization } from '@/lib/api/hooks'
import { Button } from '@/components/ui/button'

export function CreateOrganizationButton() {
  const createOrganization = useCreateOrganization()

  const handleCreate = async () => {
    await createOrganization.mutateAsync({
      name: 'New Hospital',
      type: 'hospital',
      // ... other fields
    })
  }

  return (
    <Button 
      onClick={handleCreate}
      disabled={createOrganization.isPending}
    >
      {createOrganization.isPending ? 'Creating...' : 'Create Organization'}
    </Button>
  )
}
```

## Advanced Patterns

### 1. Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/query-client'

export function useToggleOrganizationStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: 'active' | 'inactive') => 
      OrganizationsService.updateStatus(id, status),
    onMutate: async (newStatus) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.organizations.detail(id) 
      })

      // Snapshot previous value
      const previousOrg = queryClient.getQueryData(
        queryKeys.organizations.detail(id)
      )

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.organizations.detail(id),
        (old: any) => ({
          ...old,
          data: { ...old.data, status: newStatus }
        })
      )

      return { previousOrg }
    },
    onError: (err, newStatus, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.organizations.detail(id),
        context?.previousOrg
      )
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.detail(id) 
      })
    },
  })
}
```

### 2. Dependent Queries

```typescript
export function OrganizationDetails({ orgId }: { orgId: string }) {
  // First query
  const { data: org } = useOrganization(orgId)
  
  // Second query depends on first
  const { data: radiologists } = useOrganizationRadiologists(
    orgId,
    { credentialingStatus: 'active' },
    {
      // Only run when org is loaded
      enabled: !!org?.data
    }
  )

  return (
    <div>
      <h1>{org?.data?.name}</h1>
      <p>Active radiologists: {radiologists?.data?.length || 0}</p>
    </div>
  )
}
```

### 3. Polling/Real-time Updates

```typescript
export function StudyQueue() {
  const { data } = useStudies(
    { status: 'pending' },
    {
      // Refetch every 10 seconds
      refetchInterval: 10000,
      // Keep refetching when window is in background
      refetchIntervalInBackground: true,
    }
  )

  return <StudyList studies={data?.data || []} />
}
```

### 4. Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'
import { StudiesService } from '@/lib/api/services'

export function useInfiniteStudies(filters?: StudyFilters) {
  return useInfiniteQuery({
    queryKey: ['studies', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => 
      StudiesService.getStudies({ ...filters, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => 
      lastPage.meta?.hasMore ? lastPage.meta.page + 1 : undefined,
  })
}

// Usage in component
export function InfiniteStudyList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStudies()

  const studies = data?.pages.flatMap(page => page.data || []) || []

  return (
    <div>
      {studies.map(study => (
        <StudyCard key={study.id} study={study} />
      ))}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}
```

## Error Handling

### Global Error Handler (already set up in query-client.ts)

The global error handler shows toast notifications for all failed mutations.

### Custom Error Handling

```typescript
export function StudyDetails({ id }: { id: string }) {
  const { data, error, isError } = useStudy(id)

  if (isError) {
    // Check error code
    if (error?.code === 'NOT_FOUND') {
      return <NotFound />
    }
    
    if (error?.code === 'FORBIDDEN') {
      return <AccessDenied />
    }

    // Generic error
    return <ErrorMessage error={error} />
  }

  return <StudyView study={data?.data} />
}
```

## Authentication Integration

The API client automatically handles:
- Adding auth tokens to requests
- Refreshing expired tokens
- Redirecting to login on 401

No additional code needed in components!

## Tips

1. **Use TypeScript**: All hooks are fully typed
2. **Loading States**: Always handle loading states with skeletons
3. **Error Boundaries**: Wrap sections with error boundaries
4. **Prefetching**: Prefetch data on hover for better UX
5. **Cache Management**: Use `queryClient.invalidateQueries()` to refresh data

## Migration Checklist

When replacing mock data:

- [ ] Import the appropriate hook
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Replace static data with `data?.data`
- [ ] Update any mutations (create/update/delete)
- [ ] Test error scenarios
- [ ] Add proper TypeScript types