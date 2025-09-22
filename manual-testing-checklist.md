# Manual Testing Checklist

**Date**: 2025-08-12
**Build Status**: ✅ Successful
**Dev Server**: http://localhost:3000
**API**: https://api.staging.ajeris.com

## 1. Authentication (Priority: Critical)

### Login Page
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter credentials:
  - Email: admin
  - Password: !Ch4ng3Th1sP4ssW0rd!
- [ ] Verify successful login
- [ ] Check redirect to dashboard
- [ ] Verify token stored in localStorage/sessionStorage

### Logout
- [ ] Click logout in sidebar
- [ ] Verify redirect to login page
- [ ] Verify token cleared

## 2. Dashboard (Priority: High)

- [ ] Stats cards display correctly:
  - [ ] Total Studies (should show number)
  - [ ] Active Radiologists (should show number)
  - [ ] Pending Reports (should show number)
  - [ ] Critical Findings (should show number)
- [ ] Check if snake_case → camelCase conversion working
- [ ] Recent activity section loads

## 3. User Management (Priority: High)

### List View (/users)
- [ ] Table loads with user data
- [ ] Search bar works
- [ ] Role filter works
- [ ] Status filter works
- [ ] Pagination works

### Create User (/users/create)
- [ ] Form loads
- [ ] Required field validation
- [ ] Email validation
- [ ] Submit creates user
- [ ] Success toast shows
- [ ] Redirects to user list

### View User (/users/[id])
- [ ] User details display
- [ ] Activity tab loads
- [ ] Login History tab loads
- [ ] Action buttons visible

### Edit User (/users/[id]/edit)
- [ ] Form pre-populates with user data
- [ ] Can update fields
- [ ] Save works
- [ ] Success toast shows

### User Actions
- [ ] Delete user (with confirmation)
- [ ] Suspend user
- [ ] Activate user
- [ ] Reset password
- [ ] Toggle 2FA

## 4. Organization Management (Priority: High)

### List View (/organizations)
- [ ] Table loads with organization data
- [ ] Search works
- [ ] Status filter works
- [ ] Type filter works

### Create Organization (/organizations/create)
- [ ] Form loads
- [ ] HL7 settings toggle works
- [ ] Conditional fields show/hide
- [ ] Submit creates organization
- [ ] Success toast shows

### View Organization (/organizations/[id])
- [ ] Details tab shows info
- [ ] Users tab loads
- [ ] Radiologists tab has "Manage Radiologists" button
- [ ] Billing tab loads
- [ ] Settings tab loads
- [ ] Activity tab loads
- [ ] HL7 Test button works

### Edit Organization (/organizations/[id]/edit)
- [ ] Form pre-populates
- [ ] Can update fields
- [ ] Save works

## 5. Radiologist Management (Priority: High)

### List View (/radiologists)
- [ ] Table loads with radiologist data
- [ ] Specialties display
- [ ] Performance metrics show
- [ ] Availability status shows
- [ ] Search works
- [ ] Filters work

### View Radiologist (/radiologists/[id])
- [ ] Overview tab shows details
- [ ] Credentials tab loads
- [ ] Performance tab shows metrics
- [ ] Studies tab lists studies
- [ ] Organizations tab shows assignments

### Actions
- [ ] Toggle availability works

## 6. Study Management (Priority: Medium)

### List View (/studies)
- [ ] Table loads with study data
- [ ] Priority badges display correctly
- [ ] Status badges display correctly
- [ ] Filters work
- [ ] Search works

### View Study (/studies/[id])
- [ ] Details tab shows info
- [ ] Files tab loads
- [ ] Audit Log tab loads
- [ ] Notes tab loads

### Actions
- [ ] Reassign study
- [ ] Mark as critical
- [ ] Add note

## 7. Admin Members Management (Priority: Medium)

### List View (/members)
- [ ] Table loads with member data
- [ ] Role badges display
- [ ] Status badges display
- [ ] 2FA indicator shows
- [ ] Stats cards show correct counts

### Invite Member (/members/invite)
- [ ] Form loads
- [ ] Role selection shows permissions
- [ ] Submit sends invitation
- [ ] Success toast shows

### Member Actions
- [ ] Suspend member
- [ ] Activate member
- [ ] Delete member (except super admins)

## 8. Organization-Radiologist Assignment (Priority: Medium)

### Assignment Page (/organizations/[id]/radiologists)
- [ ] Navigate from organization detail page
- [ ] Stats cards show counts
- [ ] Table shows assigned radiologists
- [ ] Credentialing badges display
- [ ] ModioHealth badges display

### Assign Radiologists
- [ ] "Assign Radiologists" button opens dialog
- [ ] Available radiologists list loads
- [ ] Search in dialog works
- [ ] Multi-select with checkboxes works
- [ ] Submit assigns radiologists
- [ ] Success toast shows

### Update Credentialing
- [ ] Edit action opens dialog
- [ ] Status dropdowns work
- [ ] Notes field works
- [ ] Save updates credentialing

### Remove Radiologist
- [ ] Remove action shows confirmation
- [ ] Confirm removes radiologist
- [ ] Success toast shows

### Renew Credentials
- [ ] Only shows for expired credentials
- [ ] Clicking initiates renewal

## 9. General Functionality (Priority: High)

### Navigation
- [ ] Sidebar navigation works
- [ ] Active page highlighted
- [ ] Breadcrumbs work (if implemented)
- [ ] Back buttons work

### Error Handling
- [ ] 401 errors redirect to login
- [ ] Network errors show toast
- [ ] Form validation errors display
- [ ] Loading states show appropriately

### Performance
- [ ] Page loads are reasonably fast
- [ ] No console errors
- [ ] No infinite loops
- [ ] Pagination prevents loading too much data

## Test Results Summary

| Feature | Status | Issues Found |
|---------|--------|--------------|
| Authentication | | |
| Dashboard | | |
| Users | | |
| Organizations | | |
| Radiologists | | |
| Studies | | |
| Members | | |
| Org-Radiologist | | |

## Critical Issues Found
1. 
2. 
3. 

## Non-Critical Issues Found
1. 
2. 
3. 

## Notes
- All API responses should automatically convert from snake_case to camelCase
- All requests should automatically convert from camelCase to snake_case
- Login uses form data format, not JSON