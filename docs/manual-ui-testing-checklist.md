# Manual UI Testing Checklist

**Date Created**: 2024-12-19
**Purpose**: Visual and functional testing of API-integrated pages

## Prerequisites
- [ ] Valid test credentials for staging environment
- [ ] Development server running (`npm run dev`)
- [ ] Browser DevTools open for monitoring network requests
- [ ] React Query DevTools enabled

## Visual Testing (Can be done without login)

### Login Page
- [x] Login form displays correctly
- [x] Email and password fields present
- [x] Validation messages appear for invalid input
- [x] Loading state shown during login attempt
- [x] Error messages display properly (tested with invalid credentials)

### Layout & Navigation (Requires login)
- [ ] Sidebar navigation displays all menu items
- [ ] Active page highlighted in navigation
- [ ] User profile dropdown works
- [ ] Logout functionality clears session
- [ ] Responsive design works on mobile/tablet

## Functional Testing by Page

### Dashboard Page
- [ ] Stats cards load and display data
- [ ] Loading skeletons appear while fetching
- [ ] Error state displays if API fails
- [ ] Refresh button works
- [ ] Numbers formatted correctly
- [ ] Recent activity shows if available

### Users Page
- [ ] Table loads with user data
- [ ] Pagination controls work
- [ ] Search functionality filters results
- [ ] Role filter dropdown works
- [ ] Status filter works
- [ ] Bulk selection checkboxes work
- [ ] Action menu opens for each user
- [ ] Empty state shows when no users
- [ ] Loading state displays properly

### Organizations Page  
- [ ] List loads with organization data
- [ ] Search bar filters organizations
- [ ] HL7 configuration badges display
- [ ] Status indicators show correctly
- [ ] Action buttons work
- [ ] Details modal/page opens
- [ ] Empty state displays properly

### Radiologists Page
- [ ] List loads with radiologist data
- [ ] Performance metrics display in table
- [ ] Availability status shows correctly
- [ ] Specialties listed properly
- [ ] Search functionality works
- [ ] Filter options work
- [ ] Action menu items enabled

### Studies Page
- [ ] Studies list loads
- [ ] Priority badges (STAT, Urgent, Routine) display
- [ ] Status icons show correctly
- [ ] TAT status badges work
- [ ] Date formatting correct
- [ ] Patient info displays
- [ ] Filters work (priority, status)
- [ ] Bulk actions available
- [ ] Reassign dialog opens

## Network & Performance Testing

### API Requests
- [ ] Authorization headers sent correctly
- [ ] Pagination parameters work
- [ ] Search/filter query params sent
- [ ] Error responses handled gracefully
- [ ] 401 errors redirect to login
- [ ] Network errors show retry option

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] No unnecessary re-renders
- [ ] Data cached between navigations
- [ ] Optimistic updates work
- [ ] Loading states don't flicker

## Error Handling

### Network Errors
- [ ] Offline state detected and shown
- [ ] Retry buttons available
- [ ] Error boundaries catch crashes
- [ ] Toast notifications appear

### Validation Errors  
- [ ] Form validation messages clear
- [ ] Server validation errors displayed
- [ ] Required fields marked
- [ ] Input constraints enforced

## Accessibility

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Modals trap focus
- [ ] Escape key closes modals

### Screen Reader
- [ ] ARIA labels present
- [ ] Loading states announced
- [ ] Error messages announced
- [ ] Table headers associated

## Cross-Browser Testing

### Chrome
- [ ] All features work
- [ ] Console free of errors

### Firefox
- [ ] All features work
- [ ] Layout displays correctly

### Safari
- [ ] All features work
- [ ] No iOS-specific issues

### Edge
- [ ] All features work
- [ ] No rendering issues

## Mobile Testing

### Responsive Design
- [ ] Tables scroll horizontally
- [ ] Navigation collapses to menu
- [ ] Forms stack vertically
- [ ] Touch targets large enough

### Performance
- [ ] Loads quickly on 3G
- [ ] Images optimized
- [ ] No horizontal scroll

## Security Testing

### Authentication
- [ ] Can't access protected pages when logged out
- [ ] Token expires and redirects to login
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced

### Authorization
- [ ] Role-based features hidden
- [ ] API rejects unauthorized requests
- [ ] No client-side security bypasses

## Final Checklist

- [ ] All CRUD operations tested
- [ ] All error states handled
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Accessibility standards met
- [ ] Security best practices followed

---

**Testing Status**: Waiting for test credentials
**Blocked by**: Need staging environment access