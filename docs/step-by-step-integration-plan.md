# Step-by-Step API Integration Plan

## Phase 1: Initial Testing & Verification

### Step 1: Run API Test Page
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/test-api`
3. Enter test credentials provided by Tim
4. Click "Run API Tests"
5. Review the test logs carefully

**Expected Results:**
- ✅ API is reachable
- ✅ Login successful with token returned
- ✅ Dashboard stats endpoint returns data
- ✅ Other endpoints return appropriate responses

**Document Any Issues:**
- [ ] CORS errors?
- [ ] Authentication failures?
- [ ] Unexpected response formats?
- [ ] Missing endpoints?

### Step 2: Verify Response Formats
For each successful endpoint, verify:
1. Response structure matches our TypeScript types
2. Pagination format is consistent
3. Error responses follow expected format
4. Date formats are consistent

**Create a mapping document:**
```typescript
// Document any differences found
interface APIResponseDifferences {
  endpoint: string
  expected: any
  actual: any
  notes: string
}
```

## Phase 2: Authentication Integration

### Step 3: Update Login Flow
1. **File**: `/src/app/(auth)/login/page.tsx`
2. **Current**: Uses mock authentication
3. **Update**: Use real API

**Implementation Steps:**
```typescript
// 1. Import the login hook
import { useLogin } from '@/lib/api/hooks'

// 2. Replace mock login with:
const login = useLogin()

// 3. Update form submission:
const onSubmit = async (data) => {
  try {
    await login.mutateAsync(data)
    // Success handled by hook (redirects to dashboard)
  } catch (error) {
    // Error handled by hook (shows toast)
  }
}
```

**Test Checklist:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token stored in auth store
- [ ] Redirect to dashboard works
- [ ] Error messages display correctly

### Step 4: Update Auth Store
1. **File**: `/src/stores/auth-store.ts`
2. **Verify**: Token persistence
3. **Test**: Page refresh maintains auth

**Test Scenarios:**
- [ ] Login persists after page refresh
- [ ] Logout clears all auth data
- [ ] Protected routes redirect when not authenticated

## Phase 3: Dashboard Integration

### Step 5: Replace Dashboard Mock Data
1. **File**: `/src/app/(admin)/dashboard/page.tsx`
2. **Strategy**: Create parallel version first
3. **Test**: Compare mock vs real data

**Implementation Plan:**
1. Keep existing dashboard as backup
2. Use `page-with-api.tsx` for testing
3. Once verified, replace main dashboard

**Verification Steps:**
- [ ] Stats numbers are reasonable
- [ ] Charts render correctly
- [ ] Activity feed shows real data
- [ ] Loading states work
- [ ] Error handling works

### Step 6: Handle Edge Cases
Test these scenarios:
1. **No Data**: Empty responses
2. **Large Data**: Performance with many items
3. **Errors**: Network failures
4. **Timeout**: Slow connections

## Phase 4: CRUD Operations

### Step 7: Users Management
**Order of Implementation:**
1. List users (GET)
2. View user details (GET)
3. Create user (POST)
4. Update user (PUT)
5. Delete user (DELETE)
6. Special actions (suspend, activate, reset password)

**File Updates:**
- `/src/app/(admin)/users/page.tsx` - List view
- `/src/app/(admin)/users/[id]/page.tsx` - Detail view
- `/src/components/admin/users/*` - Components

**Testing Matrix:**
| Operation | Test Case | Expected Result |
|-----------|-----------|-----------------|
| List | No filters | Returns all users |
| List | With pagination | Returns correct page |
| List | With search | Filters correctly |
| Create | Valid data | User created |
| Create | Invalid data | Validation errors |
| Update | Change role | Role updated |
| Delete | Confirm dialog | User removed |

### Step 8: Organizations Management
Follow same pattern as users:
1. Test read operations first
2. Then test write operations
3. Verify relationships (users in org)

### Step 9: Radiologists Management
Special considerations:
- Performance endpoint format
- Credentialing data structure
- Organization relationships

### Step 10: Studies Management
Complex filters to test:
- Date ranges
- Status filters
- Urgency levels
- Assigned radiologist

## Phase 5: Error Handling & Polish

### Step 11: Global Error Handling
1. **Network Errors**: Show retry option
2. **Auth Errors**: Redirect to login
3. **Validation Errors**: Show field errors
4. **Server Errors**: Show friendly message

### Step 12: Performance Optimization
1. **Implement caching strategies**
2. **Add optimistic updates**
3. **Reduce unnecessary refetches**
4. **Add prefetching on hover**

### Step 13: Final Testing
Complete test suite:
- [ ] All CRUD operations
- [ ] All error scenarios
- [ ] Performance benchmarks
- [ ] Cross-browser testing
- [ ] Mobile responsive testing

## Rollback Plan

If issues arise:
1. **Keep mock data files**: Don't delete until fully tested
2. **Feature flags**: Use environment variables to toggle
3. **Gradual rollout**: One section at a time
4. **Quick revert**: Git branches for each phase

## Success Criteria

### Phase 1 Success:
- All 25 endpoints tested
- Response formats documented
- No blocking issues

### Phase 2 Success:
- Authentication fully working
- Tokens properly managed
- Protected routes secure

### Phase 3 Success:
- Dashboard shows real data
- Performance acceptable
- No console errors

### Phase 4 Success:
- All CRUD operations work
- Data consistency maintained
- User feedback clear

### Phase 5 Success:
- Error handling robust
- Performance optimized
- Ready for production

## Timeline Estimate

**Conservative Approach:**
- Phase 1: 2-3 hours (testing & documentation)
- Phase 2: 3-4 hours (auth integration)
- Phase 3: 2-3 hours (dashboard)
- Phase 4: 8-10 hours (all CRUD operations)
- Phase 5: 4-5 hours (polish & testing)

**Total: 19-25 hours of careful implementation**

## Next Immediate Steps

1. **Right Now**: Run the test page with credentials
2. **Document**: Any issues or discrepancies
3. **Communicate**: Share findings with Tim
4. **Plan**: Adjust based on test results
5. **Execute**: Follow this plan systematically

Remember: **Quality over speed**. Each step should be thoroughly tested before moving to the next.