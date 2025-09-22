# Missing API Endpoints for Admin Portal

**Date**: 2025-08-13  
**Subject**: Required Endpoints for Complete Admin Portal Functionality

## Overview

Based on our comprehensive analysis of the admin portal codebase and comparison with available API endpoints, the following endpoints are missing but required for full functionality. All UI components are built and ready - we just need these endpoints to be implemented.

## 🚨 Critical Missing Endpoints

### 1. **Reports Management**
The entire Reports feature has UI built but no endpoints exist:
- `GET /api/admin/reports/types` - Get available report types
- `POST /api/admin/reports/generate` - Generate a new report
- `GET /api/admin/reports/scheduled` - List scheduled reports
- `POST /api/admin/reports/schedule` - Schedule a report
- `GET /api/admin/reports/generated` - List generated reports
- `GET /api/admin/reports/{reportId}/status` - Get report generation status
- `GET /api/admin/reports/{reportId}/download` - Download generated report

### 2. **System Settings & Configuration**
- `GET /api/admin/system/settings` - Get system settings
- `PUT /api/admin/system/settings` - Update system settings
- `GET /api/admin/system/integrations` - Get integration configurations
- `POST /api/admin/system/integrations/test` - Test integration connection
- `GET /api/admin/system/health` - Get system health metrics
- `GET /api/admin/system/logs` - Get system logs
- `GET /api/admin/system/backups` - Get backup information
- `POST /api/admin/system/maintenance-mode` - Toggle maintenance mode

### 3. **Notifications & Templates**
- `GET /api/admin/notifications/templates` - Get notification templates
- `PUT /api/admin/notifications/templates/{id}` - Update notification template
- `POST /api/admin/notifications/send` - Send custom notification
- `GET /api/admin/notifications/history` - Get notification history
- `GET /api/admin/notifications/credentialing-expiry` - Get credentialing expiry notifications

### 4. **Onboarding Management**
- `GET /api/admin/onboarding` - List all onboarding organizations
- `GET /api/admin/onboarding/{orgId}/status` - Get onboarding status
- `PUT /api/admin/onboarding/{orgId}/status` - Update onboarding status
- `GET /api/admin/onboarding/{orgId}/checklist` - Get onboarding checklist
- `GET /api/admin/onboarding/tasks` - Get onboarding tasks
- `GET /api/admin/onboarding/{orgId}/radiologist-requirements` - Get radiologist requirements
- `POST /api/admin/onboarding/{orgId}/complete-credentialing` - Complete credentialing

### 5. **Credentialing Management**
- `GET /api/admin/credentialing/stats` - Get credentialing statistics
- `POST /api/admin/credentialing/modiohealth/sync` - Sync with ModioHealth
- `GET /api/admin/credentialing/expiring` - Get expiring credentials
- `GET /api/admin/credentialing/requests` - Get credentialing requests
- `GET /api/admin/credentialing/{id}` - Get credential details

### 6. **Billing Features** (Excluding main billing which is deferred)
- `GET /api/admin/billing/overview` - Get billing overview stats
- `GET /api/admin/billing/invoices` - List all invoices
- `GET /api/admin/billing/invoices/{id}` - Get invoice details
- `PUT /api/admin/billing/invoices/{id}` - Update invoice
- `POST /api/admin/billing/invoices/{id}/mark-paid` - Mark invoice as paid
- `POST /api/admin/billing/invoices/{id}/send-reminder` - Send payment reminder
- `GET /api/admin/billing/transactions` - Get transaction history

## 📊 Endpoints Returning Wrong Format

These endpoints exist but return data in unexpected formats:

### Detail Endpoints Need `data` Wrapper
All detail endpoints should return responses wrapped in a `data` field:
```json
{
  "data": {
    // entity details here
  }
}
```

Affected endpoints:
- `GET /api/admin/users/{id}`
- `GET /api/admin/radiologists/{id}`
- `GET /api/admin/organizations/{id}`
- `GET /api/admin/studies/{id}`
- All sub-resource endpoints (activity, performance, etc.)

## 🔧 Additional Endpoints Needed

### Export Functionality
- `GET /api/admin/users/export` - Export users list
- `GET /api/admin/radiologists/export` - Export radiologists list
- `GET /api/admin/organizations/export` - Export organizations list
- `GET /api/admin/studies/export` - Export studies list (already exists as `/studies/export` but needs testing)

### Compliance Extensions
- `GET /api/admin/compliance/hipaa-report` - Generate HIPAA compliance report
- `GET /api/admin/compliance/credentialing-audit` - Get credentialing audit report
- `POST /api/admin/compliance/export-audit` - Export audit logs

### Dashboard Extensions
- `GET /api/admin/dashboard/activity` - Already exists but needs to return more detailed activity feed
- `GET /api/admin/dashboard/analytics/trends` - Already exists but needs real trend data

## 📝 Implementation Notes

1. **Pagination Format**: All list endpoints should support pagination with:
   - Query params: `page`, `limit`, `search`, `sort`, `order`
   - Response format already handled by frontend mapping

2. **Error Responses**: Should be consistent across all endpoints:
   ```json
   {
     "error": {
       "code": "ERROR_CODE",
       "message": "Human readable message",
       "details": {}
     }
   }
   ```

3. **Date Formats**: All dates should be in ISO 8601 format

4. **Field Naming**: Use snake_case in API responses (frontend handles conversion)

## Priority Order

1. **High Priority** (Blocking major features):
   - System settings endpoints
   - Reports generation endpoints
   - Notification templates
   - Fix detail endpoint response format

2. **Medium Priority** (Important but have workarounds):
   - Onboarding management
   - Credentialing management
   - Compliance report generation

3. **Low Priority** (Nice to have):
   - Export functionality
   - System health monitoring
   - Backup management

## Summary

The admin portal UI is 100% complete and ready for production. We need approximately 50-60 endpoints to be implemented or fixed to achieve full functionality. The most critical are the system settings, reports, and fixing the detail endpoint response format.