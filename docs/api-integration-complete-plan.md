# Complete API Integration Plan for Admin Portal

**Date**: 2025-08-12
**Developer**: Ajeris Frontend Team
**API Base**: https://api.staging.ajeris.com

## Current Status (Updated: 2025-08-12)

### ✅ Fully Integrated
1. **Authentication** - Login/Logout/Token management working
2. **Dashboard** - Stats endpoint integrated with real-time data
3. **Users** - Full CRUD operations, activity logs, login history
4. **Organizations** - List, detail, create, edit, HL7 testing
5. **Radiologists** - List, detail, performance metrics, organizations
6. **Studies** - List, detail, workflow actions, file management
7. **Members** - List, invite, suspend/activate functionality

### 🔄 Partially Integrated
1. **Organizations** - Missing user management within org, settings
2. **Radiologists** - Missing credential management, availability toggle
3. **Studies** - Some workflow actions pending
4. **Organization-Radiologist** - Relationship management not started

### ❌ Not Yet Integrated
1. **Billing** - Invoice and transaction management
2. **Compliance** - Audit logs and compliance tracking
3. **System** - Settings and integrations
4. **Onboarding** - Organization onboarding workflow
5. **Reports** - Report generation and scheduling
6. **Notifications** - Template management and history
7. **Credentialing** - Credentialing management and sync

## Phase 1: Complete Core CRUD Operations (Priority 1)

### 1.1 Users Management
- [x] Implement user detail view (`GET /users/{id}`)
- [x] Create new user (`POST /users`)
- [x] Update user (`PUT /users/{id}`)
- [x] Delete user (`DELETE /users/{id}`)
- [x] Reset password (`POST /users/{id}/reset-password`)
- [x] Toggle 2FA (`POST /users/{id}/toggle-2fa`)
- [x] Suspend/Activate (`POST /users/{id}/suspend|activate`)
- [x] View activity log (`GET /users/{id}/activity`)
- [x] View login history (`GET /users/{id}/login-history`)

### 1.2 Organizations Management
- [x] Organization detail view (`GET /organizations/{id}`)
- [x] Create organization (`POST /organizations`)
- [x] Update organization (`PUT /organizations/{id}`)
- [x] Delete organization (`DELETE /organizations/{id}`)
- [ ] List organization users (`GET /organizations/{id}/users`)
- [ ] Invite user to org (`POST /organizations/{id}/users/invite`)
- [ ] View billing info (`GET /organizations/{id}/billing`)
- [x] Test HL7 connection (`POST /organizations/{id}/test-hl7`)
- [ ] Manage settings (`GET/PUT /organizations/{id}/settings`)

### 1.3 Radiologists Management
- [x] Radiologist detail view (`GET /radiologists/{id}`)
- [x] Update radiologist (`PUT /radiologists/{id}`)
- [ ] Manage credentials (`GET/PUT /radiologists/{id}/credentials`)
- [x] View performance (`GET /radiologists/{id}/performance`)
- [x] View assigned studies (`GET /radiologists/{id}/studies`)
- [x] Toggle availability (`POST /radiologists/{id}/toggle-availability`)
- [ ] Assign study (`POST /radiologists/{id}/assign-study`)
- [x] View organizations (`GET /radiologists/{id}/organizations`)

### 1.4 Studies Management
- [x] Study detail view (`GET /studies/{id}`)
- [x] Update study (`PUT /studies/{id}`)
- [x] Reassign study (`POST /studies/{id}/reassign`)
- [ ] Escalate study (`POST /studies/{id}/escalate`)
- [ ] Reset workflow (`POST /studies/{id}/reset-workflow`)
- [ ] Flag compliance (`POST /studies/{id}/flag-compliance`)
- [ ] Override billing (`POST /studies/{id}/override-billing`)
- [x] Delete study (`DELETE /studies/{id}`)
- [x] View audit trail (`GET /studies/{id}/audit`)
- [x] Manage files (`GET /studies/{id}/files`)
- [x] Mark as critical (`POST /studies/{id}/mark-critical`)
- [x] Add notes (`POST /studies/{id}/notes`)

## Phase 2: Admin-Specific Features (Priority 2)

### 2.1 Admin Members Management
- [x] List admin members (`GET /members`)
- [ ] View member detail (`GET /members/{id}`)
- [x] Invite new admin (`POST /members/invite`)
- [ ] Update member (`PUT /members/{id}`)
- [x] Suspend/Activate member (`POST /members/{id}/suspend|activate`)
- [x] Delete member (`DELETE /members/{id}`)
- [ ] Resend invitation (`POST /members/invitations/{id}/resend`)
- [ ] Cancel invitation (`DELETE /members/invitations/{id}`)

### 2.2 Organization-Radiologist Relationships
- [ ] List org radiologists (`GET /organizations/{orgId}/radiologists`)
- [ ] Assign radiologists (`POST /organizations/{orgId}/radiologists`)
- [ ] View radiologist detail (`GET /organizations/{orgId}/radiologists/{radId}`)
- [ ] Update relationship (`PUT /organizations/{orgId}/radiologists/{radId}`)
- [ ] Remove radiologist (`DELETE /organizations/{orgId}/radiologists/{radId}`)
- [ ] Renew credentialing (`POST /organizations/{orgId}/radiologists/{radId}/renew-credentialing`)

## Phase 3: Financial Management (Priority 3)

### 3.1 Billing Module
- [ ] Billing overview (`GET /billing/overview`)
- [ ] List invoices (`GET /billing/invoices`)
- [ ] View invoice detail (`GET /billing/invoices/{id}`)
- [ ] Update invoice (`PUT /billing/invoices/{id}`)
- [ ] Mark as paid (`POST /billing/invoices/{id}/mark-paid`)
- [ ] Send reminder (`POST /billing/invoices/{id}/send-reminder`)
- [ ] View transactions (`GET /billing/transactions`)
- [ ] Generate reports (`GET /billing/reports`)

## Phase 4: Compliance & Audit (Priority 4)

### 4.1 Compliance Management
- [ ] Compliance overview (`GET /compliance/overview`)
- [ ] View flags (`GET /compliance/flags`)
- [ ] Audit logs (`GET /compliance/audit-logs`)
- [ ] Export audit (`GET /compliance/export-audit`)
- [ ] HIPAA report (`GET /compliance/hipaa-report`)
- [ ] Credentialing audit (`GET /compliance/credentialing-audit`)

### 4.2 Credentialing
- [ ] Credentialing stats (`GET /credentialing/stats`)
- [ ] ModioHealth sync (`POST /credentialing/modiohealth/sync`)
- [ ] View expiring credentials (`GET /credentialing/expiring`)

## Phase 5: System Administration (Priority 5)

### 5.1 System Settings
- [ ] View settings (`GET /system/settings`)
- [ ] Update settings (`PUT /system/settings`)
- [ ] Manage integrations (`GET /system/integrations`)
- [ ] Test integration (`POST /system/integrations/test`)
- [ ] View logs (`GET /system/logs`)
- [ ] Health check (`GET /system/health`)
- [ ] Clear cache (`POST /system/cache/clear`)
- [ ] Manage backups (`GET /system/backups`)
- [ ] Toggle maintenance (`POST /system/maintenance-mode`)

### 5.2 Onboarding Management
- [ ] List onboarding orgs (`GET /onboarding`)
- [ ] View status (`GET /onboarding/{orgId}/status`)
- [ ] Update status (`PUT /onboarding/{orgId}/status`)
- [ ] View checklist (`GET /onboarding/{orgId}/checklist`)
- [ ] Manage tasks (`GET /onboarding/tasks`)
- [ ] Radiologist requirements (`GET /onboarding/{orgId}/radiologist-requirements`)
- [ ] Complete credentialing (`POST /onboarding/{orgId}/complete-credentialing`)

## Phase 6: Reporting & Communications (Priority 6)

### 6.1 Reports
- [ ] List report types (`GET /reports/types`)
- [ ] Generate report (`POST /reports/generate`)
- [ ] View scheduled (`GET /reports/scheduled`)
- [ ] Schedule report (`POST /reports/schedule`)
- [ ] Credentialing reports (`GET /reports/credentialing`)

### 6.2 Notifications
- [ ] List templates (`GET /notifications/templates`)
- [ ] Update template (`PUT /notifications/templates/{id}`)
- [ ] Send notification (`POST /notifications/send`)
- [ ] View history (`GET /notifications/history`)
- [ ] Credentialing expiry alerts (`GET /notifications/credentialing-expiry`)

## Implementation Strategy

### Best Practices to Follow:
1. **Error Handling**: Implement comprehensive error handling for all API calls
2. **Loading States**: Show appropriate loading indicators
3. **Optimistic Updates**: For better UX on mutations
4. **Cache Management**: Use React Query's caching effectively
5. **Type Safety**: Ensure all API responses are properly typed
6. **Response Mapping**: Handle snake_case to camelCase conversions
7. **Permission Checks**: Implement proper authorization checks
8. **Pagination**: Handle pagination consistently across all lists
9. **Search/Filter**: Implement debounced search where applicable
10. **Validation**: Client-side validation before API calls

### Technical Approach:
1. **Services**: Create service classes for each module
2. **Hooks**: Create custom hooks using React Query
3. **Types**: Define TypeScript interfaces for all entities
4. **Components**: Build reusable components for common patterns
5. **Forms**: Use react-hook-form for complex forms
6. **Tables**: Implement sortable, filterable tables
7. **Modals**: Use dialog components for CRUD operations
8. **Toasts**: Show success/error notifications
9. **Breadcrumbs**: Implement navigation breadcrumbs
10. **Testing**: Write tests for critical paths

### Development Order:
1. Start with Phase 1 (Core CRUD) - Most important for daily operations
2. Complete Phase 2 (Admin features) - Essential for admin portal
3. Implement Phase 3 (Billing) - Critical for business operations
4. Add Phase 4 (Compliance) - Important for regulatory requirements
5. Build Phase 5 (System) - For system administration
6. Finish with Phase 6 (Reports) - For analytics and communications

## API Integration Issues Found

### Type Mismatches (Backend needs to align with frontend):
1. **Organization Types**: Frontend expects "Hospital" | "Imaging Center" | "Clinic", API returns lowercase
2. **Status Enums**: Frontend uses proper case (e.g., "Active"), API uses lowercase
3. **Missing Fields**:
   - Organizations: `primaryContact`, `city`, `state` (nested in address)
   - Dashboard: `pendingReports`, `criticalFindings`, change percentages
   - Pagination meta: `totalPages` property
4. **Field Name Differences**: Response mappers handle most, but some inconsistencies remain

### Important Note:
As per directive: "The frontend takes priority always" - UI should never be modified to match backend limitations. All mismatches documented here should be fixed in the backend API.

## Next Steps:
1. Complete organization-radiologist relationship management
2. Continue with Phase 3 (Billing module)
3. Test thoroughly with real data
4. Handle edge cases and error scenarios
5. Document any additional API issues found
6. Deploy and monitor performance