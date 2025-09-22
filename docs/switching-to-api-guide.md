# Guide: Switching from Mock Data to API

## Status: ✅ All Pages Switched to API (2024-12-19)

All admin pages have been successfully switched from mock data to real API integration.

### Completed Switches:

1. **Dashboard** ✅ - Using real API
2. **Users Page** ✅ - Using real API
3. **Organizations Page** ✅ - Using real API
4. **Radiologists Page** ✅ - Using real API  
5. **Studies Page** ✅ - Using real API

### Backup Files:
All original mock pages have been preserved as `.backup.tsx` files in their respective directories.

## Testing Checklist

After switching each page:

### Basic Functionality
- [ ] Page loads without errors
- [ ] Data displays correctly
- [ ] Search works
- [ ] Filters apply correctly
- [ ] Pagination works
- [ ] Sorting works (if implemented)

### CRUD Operations
- [ ] Create new record
- [ ] View record details
- [ ] Edit existing record
- [ ] Delete record (with confirmation)
- [ ] Bulk operations (if applicable)

### Error Handling
- [ ] Network error shows retry option
- [ ] 401 redirects to login
- [ ] 403 shows permission denied
- [ ] Empty state displays correctly

### Performance
- [ ] Loading states show
- [ ] No unnecessary re-renders
- [ ] Caching works correctly

## Rollback Instructions

If you need to rollback to mock data:

```bash
# Example for users page
mv src/app/(admin)/users/page.tsx src/app/(admin)/users/page-with-api.tsx
mv src/app/(admin)/users/page.backup.tsx src/app/(admin)/users/page.tsx
```

## API Endpoints Reference

| Feature | List | Create | Read | Update | Delete |
|---------|------|--------|------|--------|--------|
| Users | GET /api/admin/users | POST /api/admin/users | GET /api/admin/users/{id} | PUT /api/admin/users/{id} | DELETE /api/admin/users/{id} |
| Organizations | GET /api/admin/organizations | POST /api/admin/organizations | GET /api/admin/organizations/{id} | PUT /api/admin/organizations/{id} | DELETE /api/admin/organizations/{id} |
| Radiologists | GET /api/admin/radiologists | - | GET /api/admin/radiologists/{id} | PUT /api/admin/radiologists/{id} | - |
| Studies | GET /api/admin/studies | - | GET /api/admin/studies/{id} | PUT /api/admin/studies/{id} | DELETE /api/admin/studies/{id} |

## Common Issues & Solutions

### Issue: Data not loading
**Solution**: Check browser console for errors, verify API is reachable

### Issue: 401 Unauthorized
**Solution**: Clear localStorage and login again

### Issue: CORS errors
**Solution**: Verify you're using the correct API URL, check with backend team

### Issue: Slow performance
**Solution**: Check React Query DevTools, look for duplicate requests

## Support

If you encounter issues:
1. Check browser console for errors
2. Review the API issues document: `/docs/api-issues-for-tim.md`
3. Contact backend team with specific error details

## Notes

- All API integrations use React Query for caching
- Error handling is standardized across all pages
- Loading states use skeleton components
- All forms validate before submission
- Delete operations require confirmation