# Temporary Mock Interceptors

**Date**: 2025-08-13  
**Purpose**: Document all temporary mock interceptors added to make the UI functional while backend endpoints are being implemented.

## Overview

We've added temporary mock interceptors in `/src/lib/api/client.ts` to provide mock data for endpoints that are either:
1. Returning empty/wrong data format
2. Not yet implemented by the backend
3. Returning errors

These mocks allow the UI to function properly for demo/testing purposes while we wait for backend implementation.

## Mock Interceptors Added

### 1. User Details
- **Endpoint**: `/api/admin/users/71`
- **Reason**: Returns empty/incomplete data
- **Mock Data**: Complete user profile for Kamal Akanni with all required fields

### 2. User Activity & Login History
- **Endpoints**: 
  - `/api/admin/users/71/activity`
  - `/api/admin/users/71/login-history`
- **Reason**: Sub-endpoints for user details
- **Mock Data**: Sample activity logs and login history

### 3. Radiologists List
- **Endpoint**: `/api/admin/radiologists`
- **Reason**: Returns empty array or wrong format
- **Mock Data**: 3 sample radiologists with complete data

### 4. Organizations List
- **Endpoint**: `/api/admin/organizations`
- **Reason**: Returns empty array or wrong format
- **Mock Data**: 3 sample organizations with different statuses

### 5. Users List
- **Endpoint**: `/api/admin/users`
- **Reason**: Provides consistent test data
- **Mock Data**: 2 sample users including Kamal Akanni

### 6. Studies List
- **Endpoint**: `/api/admin/studies`
- **Reason**: Returns error - completely broken
- **Mock Data**: 3 sample studies with different statuses

### 7. Statistics Endpoints (All Missing)
- **Endpoints**:
  - `/api/admin/studies/stats`
  - `/api/admin/radiologists/stats`
  - `/api/admin/organizations/stats`
  - `/api/admin/users/stats`
  - `/api/admin/credentialing/stats`
- **Reason**: Endpoints don't exist, stats are hardcoded in frontend
- **Mock Data**: Statistics matching the hardcoded values

### 8. System Settings
- **Endpoint**: `/api/admin/system/settings`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: Complete system settings structure

### 9. Compliance Audit Logs
- **Endpoint**: `/api/admin/compliance/audit-logs`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: Sample audit log entries

### 10. Report Generation
- **Endpoint**: `/api/admin/reports/generate`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: Simulated report generation response

### 11. System Health
- **Endpoint**: `/api/admin/system/health`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: System health status with service checks

### 12. Notification Templates
- **Endpoint**: `/api/admin/notifications/templates`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: Sample notification templates

### 13. Onboarding List
- **Endpoint**: `/api/admin/onboarding`
- **Reason**: Endpoint doesn't exist
- **Mock Data**: Organizations in various onboarding stages

## How to Remove Mocks

Once backend endpoints are implemented:

1. Locate the mock interceptor in `/src/lib/api/client.ts`
2. Find the sections marked with:
   - `// ========== TEMPORARY MOCK INTERCEPTORS ==========` (in success handler)
   - `// ========== TEMPORARY MOCK INTERCEPTORS FOR ERROR RESPONSES ==========` (in error handler)
3. Remove the specific `else if` block for the implemented endpoint from BOTH sections
4. Test to ensure the real endpoint returns data in the expected format

## Technical Note

We have mock interceptors in two places:
1. **Success Response Interceptor** - For endpoints that return 200 but with empty/wrong data
2. **Error Response Interceptor** - For endpoints that return error status codes (400, 404, 500, etc.)

The error interceptor is necessary because some endpoints fail before the success interceptor can catch them.

## Important Notes

- All mocks log to console when triggered (look for "=== MOCK: Intercepting..." messages)
- Mocks return data in the format expected by the frontend
- Snake_case to camelCase conversion is handled automatically
- These mocks should be removed once real endpoints are available

## Related Documentation

- See `/docs/api-issues-for-tim.md` for the list of issues that need backend implementation
- Mock data formats match the expected API responses documented in the service files