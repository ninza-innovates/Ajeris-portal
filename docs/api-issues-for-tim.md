# API Issues & Feedback for Tim

**Date**: 2025-08-13  
**Subject**: Critical Data Loading Issues & Missing Endpoints  
**Frontend Developer**: Ajeris Frontend Team

## Executive Summary

During testing today, we discovered that most statistics displayed in the admin portal are **hardcoded placeholder values**, not real API data. Additionally, several critical endpoints are either returning empty data or data in unexpected formats. This document outlines the current issues and what's needed to resolve them.

## 🚨 CRITICAL ISSUES - Data Not Loading

### 1. Hardcoded Statistics (Not Real Data)

The following statistics are currently **hardcoded** in the frontend code:

| Page | Displayed Values | Location in Code | Endpoint Needed |
|------|-----------------|------------------|-----------------|
| **Studies** | 12,456 All time<br>3,456 Studies assigned<br>234 Awaiting review<br>18 Require attention | `/src/hooks/use-studies.ts`<br>lines 300-316 | `/api/admin/studies/stats` |
| **Radiologists** | 125 Total Radiologists<br>98 Active/On-Call<br>8456 Studies Today<br>4.2 hr Average TAT | `/src/hooks/use-radiologists.ts`<br>lines 192-207 | `/api/admin/radiologists/stats` |
| **Organizations** | 45 Total Organizations<br>38 Active<br>1247 Total Users<br>12456 Monthly Studies<br>$48,250 Outstanding | `/src/lib/api/services/organizations.service.ts`<br>lines 164-177 | `/api/admin/organizations/stats` |
| **Users** | 247 Total Users<br>198 Logged in last 30 days<br>156 Licensed professionals | Hardcoded in page component | `/api/admin/users/stats` |

### 2. API Endpoints Returning Empty/No Data

These endpoints are being called but not returning expected data:

| Endpoint | Issue | Temporary Fix Applied |
|----------|-------|---------------------|
| `/api/admin/studies` | Returns error - "Error Loading Studies" displayed | None - still broken |
| `/api/admin/users/71` | Returns empty/incomplete data for user details | Added mock interceptor |
| `/api/admin/radiologists` | Returns empty array or wrong format | Added mock interceptor |
| `/api/admin/organizations` | Returns empty array or wrong format | Added mock interceptor |

### 3. Working Endpoints ✅

- `/api/admin/dashboard/stats` - Returns real data (19 studies, 20 radiologists, etc.)
- `/api/admin/users` - Returns real user list
- Authentication endpoints - Working correctly

## 📋 Required Statistics Endpoints

To replace the hardcoded values, we need these endpoints:

### 1. Studies Statistics
**Endpoint**: `GET /api/admin/studies/stats`
```json
{
  "totalStudies": 12456,
  "assignedStudies": 3456,
  "awaitingReview": 234,
  "requireAttention": 18,
  "completedToday": 125,
  "averageTAT": 4.2
}
```

### 2. Radiologists Statistics  
**Endpoint**: `GET /api/admin/radiologists/stats`
```json
{
  "totalRadiologists": 125,
  "activeRadiologists": 98,
  "onCallNow": 12,
  "studiesThisMonth": 8456,
  "averageTAT": 4.2,
  "pendingCredentials": 3
}
```

### 3. Organizations Statistics
**Endpoint**: `GET /api/admin/organizations/stats`
```json
{
  "totalOrganizations": 45,
  "activeOrganizations": 38,
  "totalUsers": 1247,
  "monthlyStudies": 12456,
  "totalOutstandingBalance": 48250,
  "organizationsWithOverdue": 3
}
```

### 4. Users Statistics
**Endpoint**: `GET /api/admin/users/stats`
```json
{
  "totalUsers": 247,
  "activeLastMonth": 198,
  "licensedProfessionals": 156,
  "facilityUsers": 91,
  "pendingVerification": 23
}
```

## 🔧 Data Format Issues

For the endpoints that exist but aren't working:

### 1. User Details (`/api/admin/users/{id}`)
**Missing fields needed**:
- `organizationName` - Organization name (not just ID)
- `lastLogin` - Last login timestamp
- `invitedBy` - Who invited this user
- `invitedAt` - When they were invited
- `twoFactorEnabled` - 2FA status
- `emailVerified` - Email verification status

### 2. Studies List (`/api/admin/studies`)
**Response format expected**:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 3. Organizations & Radiologists Lists
Same paginated format as above with proper data array.

## 🆕 Missing Endpoints for Features

These features are built but need backend endpoints:

### High Priority
1. **System Settings** - `/api/admin/system/settings` (GET/PUT)
2. **Report Generation** - `/api/admin/reports/generate` (POST)
3. **Compliance Audit Logs** - `/api/admin/compliance/audit-logs` (GET)
4. **Credentialing Stats** - `/api/admin/credentialing/stats` (GET)

### Medium Priority
1. **Onboarding Management** - `/api/admin/onboarding` endpoints
2. **Notification Templates** - `/api/admin/notifications/templates`
3. **System Health Monitoring** - `/api/admin/system/health`

## 🚀 Recommendations

### Immediate Actions Needed:
1. **Implement statistics endpoints** to replace hardcoded values
2. **Fix data format** for studies, radiologists, and organizations lists
3. **Add missing fields** to user details endpoint
4. **Ensure consistent pagination format** across all list endpoints

### Response Format Standard:
All list endpoints should use this format:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasMore": false
  }
}
```

## Notes on Case Conversion

We've already implemented automatic snake_case ↔️ camelCase conversion in our API client, so field naming conventions are not an issue. The problems listed above are about missing data and endpoints, not naming differences.

---

**Contact**: If you need any clarification or want to see specific error logs, please let me know. The frontend is ready and waiting for these endpoints to display real data.

