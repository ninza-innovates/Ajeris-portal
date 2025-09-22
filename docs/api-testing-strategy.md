# API Testing Strategy

## Overview
This document outlines the testing strategy for integrating the Ajeris Admin Portal frontend with Tim's backend API endpoints.

## Current Status
- **Base URL**: https://api.staging.ajeris.com
- **Ready Endpoints**: 25 admin endpoints (as per Tim's message)
- **Authentication**: JWT Bearer token
- **Special Cases**: Admin log endpoint expects form data

## Testing Phases

### Phase 1: Connection & Authentication
**Priority: CRITICAL**

1. **API Health Check**
   - Test basic connectivity to staging server
   - Verify CORS configuration
   - Check SSL certificate validity

2. **Authentication Flow**
   - Test login with valid credentials
   - Verify token format and storage
   - Test token in Authorization header
   - Test logout functionality

**Test Checklist:**
- [ ] Can reach staging server
- [ ] CORS allows requests from localhost
- [ ] Login returns valid JWT token
- [ ] Token includes user role information
- [ ] Logout endpoint works correctly

### Phase 2: Core CRUD Operations
**Priority: HIGH**

Test each endpoint group systematically:

#### Dashboard (1 endpoint)
- [ ] GET /api/admin/dashboard/stats

#### Users (8 endpoints)
- [ ] GET /api/admin/users (with pagination)
- [ ] POST /api/admin/users
- [ ] GET /api/admin/users/{user_id}
- [ ] PUT /api/admin/users/{user_id}
- [ ] DELETE /api/admin/users/{user_id}
- [ ] POST /api/admin/users/{user_id}/reset-password
- [ ] POST /api/admin/users/{user_id}/suspend
- [ ] POST /api/admin/users/{user_id}/activate

#### Organizations (6 endpoints)
- [ ] GET /api/admin/organizations
- [ ] POST /api/admin/organizations
- [ ] GET /api/admin/organizations/{id}
- [ ] PUT /api/admin/organizations/{id}
- [ ] DELETE /api/admin/organizations/{id}
- [ ] GET /api/admin/organizations/{id}/users

#### Radiologists (4 endpoints)
- [ ] GET /api/admin/radiologists
- [ ] GET /api/admin/radiologists/{id}
- [ ] PUT /api/admin/radiologists/{id}
- [ ] GET /api/admin/radiologists/{id}/performance

#### Studies (4 endpoints)
- [ ] GET /api/admin/studies
- [ ] GET /api/admin/studies/{id}
- [ ] PUT /api/admin/studies/{id}
- [ ] DELETE /api/admin/studies/{id}

### Phase 3: Advanced Features
**Priority: MEDIUM**

1. **Pagination Testing**
   - Test page parameter
   - Test limit parameter
   - Verify response metadata

2. **Filtering & Search**
   - Test query parameters
   - Test date range filters
   - Test status filters

3. **Error Handling**
   - Test 400 Bad Request scenarios
   - Test 401 Unauthorized
   - Test 403 Forbidden
   - Test 404 Not Found
   - Test 500 Server errors

4. **Rate Limiting**
   - Monitor rate limit headers
   - Test behavior at limits
   - Implement backoff strategy

### Phase 4: Integration Testing
**Priority: HIGH**

1. **Complete User Flows**
   - Login → View Dashboard → Manage Users
   - Create Org → Add Users → View Details
   - Update Radiologist → Check Performance

2. **Data Consistency**
   - Create → Read → Update → Delete cycles
   - Verify data relationships
   - Check cascading operations

3. **Performance Testing**
   - Response time benchmarks
   - Concurrent request handling
   - Large dataset handling

## Testing Tools

### 1. API Test Page (`/test-api`)
- Interactive testing interface
- Real-time log output
- Credential configuration

### 2. Console Testing
```javascript
// Run in browser console
window.testApi()
```

### 3. Automated Tests
```typescript
// Example test structure
describe('Admin API Integration', () => {
  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      // Test implementation
    })
  })
})
```

## Common Issues & Solutions

### CORS Errors
**Symptom**: "Access-Control-Allow-Origin" errors

**Solutions**:
1. Verify staging server CORS configuration
2. Use proxy in development:
   ```javascript
   // next.config.js
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'https://api.staging.ajeris.com/api/:path*',
         },
       ]
     },
   }
   ```

### Authentication Failures
**Symptom**: 401 errors after login

**Solutions**:
1. Check token storage in auth store
2. Verify Authorization header format
3. Test token expiration handling

### Form Data Issues
**Symptom**: Admin log endpoint fails

**Solutions**:
1. Use `postFormData` method for form endpoints
2. Verify Content-Type header
3. Check field names match API expectations

## Test Data Requirements

### Test Accounts
- **Super Admin**: Full system access
- **Admin**: Organization-level access
- **Viewer**: Read-only access

### Test Organizations
- Active organization with users
- Suspended organization
- Organization with radiologists

### Test Studies
- Completed studies
- Pending studies
- Critical/urgent studies

## Success Criteria

### Phase 1 Complete When:
- [x] Can authenticate successfully
- [x] Token management works
- [x] Basic API connectivity confirmed

### Phase 2 Complete When:
- [ ] All 25 endpoints tested
- [ ] CRUD operations work
- [ ] Error responses handled

### Phase 3 Complete When:
- [ ] Pagination works correctly
- [ ] Filters apply properly
- [ ] Rate limiting handled

### Phase 4 Complete When:
- [ ] User flows work end-to-end
- [ ] Performance meets targets
- [ ] No data inconsistencies

## Next Steps

1. **Immediate Actions**:
   - Run connection test with valid credentials
   - Document any API discrepancies
   - Create issue list for Tim

2. **Short Term**:
   - Wire up authentication flow
   - Replace mock data in dashboard
   - Test user management

3. **Long Term**:
   - Complete all endpoint integrations
   - Implement comprehensive error handling
   - Add automated test coverage