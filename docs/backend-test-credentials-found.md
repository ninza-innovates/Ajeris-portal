# Backend Test Credentials Found

**Date**: 2024-12-19
**Purpose**: Document all test credentials found in backend for Tim's reference

## Test Accounts Found in Backend Code

### 1. Default Admin (from environment config)
- **Email**: admin@admin.com
- **Password**: !Ch4ng3Th1sP4ssW0rd!
- **Username**: admin
- **Role**: ADMIN with superuser privileges
- **Status**: ❌ Not working on staging (401 Invalid username or password)

### 2. Main Test User (from seed_simple_test_data.py)
- **Email**: yashshah@example.com
- **Password**: Admin123#
- **Username**: yashshah
- **Role**: RAD (Radiologist) with superuser privileges
- **Status**: ⚠️ Not tested on staging

### 3. Admin Account (from seed scripts)
- **Email**: admin@ajeris.com
- **Password**: Admin123#
- **Username**: admin
- **Role**: ADMIN with superuser privileges
- **Status**: ⚠️ Not tested on staging

### 4. Billing Account
- **Email**: billing@ajeris.com
- **Password**: Billing123#
- **Username**: billing
- **Role**: BILLING
- **Status**: ⚠️ Not tested on staging

### 5. Test Radiologists
```
testrad@example.com / Password123# (username: testrad)
sarah.johnson@example.com / Password123# (username: sjohnson)
michael.chen@example.com / Password123# (username: mchen)
emily.rodriguez@example.com / Password123# (username: erodriguez)
```

### 6. Test Healthcare Users
```
testclinic@example.com / Password123# (username: testclinic)
james.wilson@citymedical.com / Password123# (username: jwilson)
linda.taylor@quickcare.com / Password123# (username: ltaylor)
robert.anderson@metro.com / Password123# (username: randerson)
```

## Seed Scripts Available

The backend has these scripts to create test data:

1. **Simple Test Data**:
   ```bash
   python -m src.scripts.seed_simple_test_data
   ```

2. **Comprehensive Test Data**:
   ```bash
   python -m src.scripts.seed_comprehensive_test_data
   ```

3. **Database Setup with Mock Data**:
   ```bash
   python -m src.scripts.setup_database
   ```

## Questions for Tim

1. **Are these test accounts available on the staging environment?**
   - If not, can you run the seed scripts on staging?
   - Or provide us with working test credentials?

2. **Which test account should we use for admin portal testing?**
   - Need an account with ADMIN or SUPER_ADMIN role
   - Need to test all admin functionality

3. **Is there a different set of credentials for staging?**
   - The default admin credentials don't work
   - Do you have staging-specific test accounts?

## Login Endpoint Details

We've confirmed the admin login endpoint configuration:
- **URL**: POST /api/admin/auth/login
- **Content-Type**: application/x-www-form-urlencoded
- **Fields**: username (accepts email), password
- **Response**: { access_token, token_type, message }

The frontend has been updated to use this format correctly.

---

**Status**: Waiting for valid staging credentials to proceed with testing