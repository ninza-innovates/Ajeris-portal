# API Integration Plan - Frontend to Backend

## Current Status Analysis

### Tim's Completed Endpoints (25 endpoints ready)

#### Authentication (2 endpoints)
- ✅ POST `/api/admin/auth/login`
- ✅ POST `/api/admin/auth/logout`

#### Dashboard (1 endpoint)
- ✅ GET `/api/admin/dashboard/stats`

#### User Management (8 endpoints)
- ✅ GET `/api/admin/users`
- ✅ POST `/api/admin/users`
- ✅ GET `/api/admin/users/{user_id}`
- ✅ PUT `/api/admin/users/{user_id}`
- ✅ DELETE `/api/admin/users/{user_id}`
- ✅ POST `/api/admin/users/{user_id}/reset-password`
- ✅ POST `/api/admin/users/{user_id}/suspend`
- ✅ POST `/api/admin/users/{user_id}/activate`

#### Radiologist Management (4 endpoints)
- ✅ GET `/api/admin/radiologists`
- ✅ GET `/api/admin/radiologists/{radiologist_id}`
- ✅ PUT `/api/admin/radiologists/{radiologist_id}`
- ✅ GET `/api/admin/radiologists/{radiologist_id}/performance`

#### Organization Management (6 endpoints)
- ✅ GET `/api/admin/organizations`
- ✅ POST `/api/admin/organizations`
- ✅ GET `/api/admin/organizations/{organization_id}`
- ✅ PUT `/api/admin/organizations/{organization_id}`
- ✅ DELETE `/api/admin/organizations/{organization_id}`
- ✅ GET `/api/admin/organizations/{organization_id}/users`

#### Study Management (4 endpoints)
- ✅ GET `/api/admin/studies`
- ✅ GET `/api/admin/studies/{study_id}`
- ✅ PUT `/api/admin/studies/{study_id}`
- ✅ DELETE `/api/admin/studies/{study_id}`

### Important Notes from Tim
1. **Admin log endpoint expects form data format** - All other endpoints expect JSON
2. **Rate limiting headers still being finalized**
3. Endpoints follow pagination format specified in docs
4. Only admins can access these endpoints

### Staging Environment
- Base URL: `https://api.staging.ajeris.com`
- Documentation: `https://api.staging.ajeris.com/docs`

## Implementation Plan

### Phase 1: Foundation Setup ✅
1. **Update API Configuration**
   - Change base URL to staging server
   - Update endpoint paths to match Tim's `/api/admin/` structure
   - Configure form data handling for admin log endpoint

2. **Authentication Testing**
   - Test login endpoint with real credentials
   - Verify token storage and refresh mechanism
   - Test logout functionality

### Phase 2: Core Features
3. **Dashboard Integration**
   - Wire up dashboard stats
   - Test real-time data display

4. **User Management**
   - List users with pagination
   - Create/update/delete users
   - Password reset functionality
   - Suspend/activate users

5. **Organization Management**
   - CRUD operations for organizations
   - Organization users listing

### Phase 3: Advanced Features
6. **Radiologist Management**
   - List and detail views
   - Performance metrics integration
   - Update radiologist information

7. **Study Management**
   - Study listing with filters
   - Study details and updates
   - Study deletion

### Phase 4: Polish & Error Handling
8. **Error Handling**
   - Rate limiting response handling
   - Form validation errors
   - Network error recovery

9. **Performance Optimization**
   - Implement proper caching strategies
   - Optimize pagination handling
   - Add loading states

## Technical Considerations

### API Client Updates Needed
1. **Base URL**: Update from mock to `https://api.staging.ajeris.com`
2. **Endpoint Paths**: Update all paths to use `/api/admin/` prefix
3. **Form Data**: Special handling for admin log endpoint
4. **Headers**: Prepare for rate limiting headers

### Testing Strategy
1. **Unit Tests**: Test each API service method
2. **Integration Tests**: Test complete user flows
3. **Error Scenarios**: Test network failures, 401s, 403s, 500s
4. **Rate Limiting**: Test behavior when rate limited

### Security Considerations
1. **Token Storage**: Ensure secure token storage
2. **Token Refresh**: Automatic refresh on 401
3. **CORS**: Handle CORS properly for staging environment
4. **HTTPS**: All requests over HTTPS

## Priority Order
1. **Authentication** - Foundation for all other features
2. **Dashboard** - Immediate value for admins
3. **Users** - Core admin functionality
4. **Organizations** - Business critical
5. **Radiologists** - Operational necessity
6. **Studies** - Clinical operations

## Risk Mitigation
1. **Incomplete Endpoints**: Have fallback UI for missing endpoints
2. **API Changes**: Version checking and graceful degradation
3. **Rate Limiting**: Implement exponential backoff
4. **Network Issues**: Offline support where possible

## Success Metrics
- All 25 endpoints successfully integrated
- < 3s page load times
- 0 authentication failures
- Graceful error handling for all edge cases
- Real-time data updates where applicable