#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function testCrudOperations() {
  console.log('🔍 Testing CRUD Operations...\n')

  try {
    // Login first
    console.log('Logging in...')
    const params = new URLSearchParams()
    params.append('username', ADMIN_EMAIL)
    params.append('password', ADMIN_PASSWORD)
    
    const loginResponse = await axios.post(
      `${API_BASE_URL}/api/admin/auth/login`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const { access_token } = loginResponse.data
    console.log('✅ Login successful\n')

    // Configure axios with auth token
    const api = axios.create({
      baseURL: `${API_BASE_URL}/api/admin`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Test Users CRUD
    console.log('👤 Testing User CRUD Operations')
    console.log('='.repeat(50))
    
    // Create User
    console.log('\n1️⃣ CREATE User:')
    let testUserId: string | null = null
    try {
      const createResponse = await api.post('/users', {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'VIEWER',
        password: 'TestPassword123!'
      })
      console.log('✅ Create successful')
      testUserId = createResponse.data.data?.id || createResponse.data.id
      console.log(`   Created user ID: ${testUserId}`)
    } catch (error: any) {
      console.log(`❌ Create failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
    }

    // Read User
    if (testUserId) {
      console.log('\n2️⃣ READ User:')
      try {
        const readResponse = await api.get(`/users/${testUserId}`)
        console.log('✅ Read successful')
        console.log(`   User name: ${readResponse.data.data?.name || readResponse.data.name}`)
      } catch (error: any) {
        console.log(`❌ Read failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Update User
      console.log('\n3️⃣ UPDATE User:')
      try {
        const updateResponse = await api.put(`/users/${testUserId}`, {
          name: 'Updated Test User'
        })
        console.log('✅ Update successful')
      } catch (error: any) {
        console.log(`❌ Update failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Delete User
      console.log('\n4️⃣ DELETE User:')
      try {
        await api.delete(`/users/${testUserId}`)
        console.log('✅ Delete successful')
      } catch (error: any) {
        console.log(`❌ Delete failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }
    }

    // Test Organization operations
    console.log('\n\n🏢 Testing Organization Operations')
    console.log('='.repeat(50))
    
    // Get first organization for testing
    const orgsResponse = await api.get('/organizations')
    const firstOrgId = orgsResponse.data.data?.[0]?.id
    
    if (firstOrgId) {
      // Update Organization
      console.log('\n1️⃣ UPDATE Organization:')
      try {
        const updateResponse = await api.put(`/organizations/${firstOrgId}`, {
          phone: '555-0123'
        })
        console.log('✅ Update successful')
      } catch (error: any) {
        console.log(`❌ Update failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Test HL7
      console.log('\n2️⃣ Test HL7 Connection:')
      try {
        const hl7Response = await api.post(`/organizations/${firstOrgId}/test-hl7`)
        console.log('✅ HL7 test successful')
      } catch (error: any) {
        console.log(`❌ HL7 test failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }
    }

    // Test Study operations
    console.log('\n\n📄 Testing Study Operations')
    console.log('='.repeat(50))
    
    // Get first study for testing
    const studiesResponse = await api.get('/studies')
    const firstStudyId = studiesResponse.data.data?.[0]?.id
    
    if (firstStudyId) {
      // Update Study
      console.log('\n1️⃣ UPDATE Study:')
      try {
        const updateResponse = await api.put(`/studies/${firstStudyId}`, {
          priority: 'urgent'
        })
        console.log('✅ Update successful')
      } catch (error: any) {
        console.log(`❌ Update failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Reassign Study
      console.log('\n2️⃣ REASSIGN Study:')
      try {
        const reassignResponse = await api.post(`/studies/${firstStudyId}/reassign`, {
          radiologistId: '2',
          reason: 'Testing reassignment'
        })
        console.log('✅ Reassign successful')
      } catch (error: any) {
        console.log(`❌ Reassign failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Flag Compliance
      console.log('\n3️⃣ FLAG Compliance:')
      try {
        const flagResponse = await api.post(`/studies/${firstStudyId}/flag-compliance`, {
          reason: 'Testing compliance flag'
        })
        console.log('✅ Flag compliance successful')
      } catch (error: any) {
        console.log(`❌ Flag compliance failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }
    }

    // Test Radiologist operations
    console.log('\n\n🩺 Testing Radiologist Operations')
    console.log('='.repeat(50))
    
    // Get first radiologist for testing
    const radsResponse = await api.get('/radiologists')
    const firstRadId = radsResponse.data.data?.[0]?.id
    
    if (firstRadId) {
      // Update Radiologist
      console.log('\n1️⃣ UPDATE Radiologist:')
      try {
        const updateResponse = await api.put(`/radiologists/${firstRadId}`, {
          phone: '555-9876'
        })
        console.log('✅ Update successful')
      } catch (error: any) {
        console.log(`❌ Update failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Toggle Availability
      console.log('\n2️⃣ TOGGLE Availability:')
      try {
        const toggleResponse = await api.post(`/radiologists/${firstRadId}/toggle-availability`)
        console.log('✅ Toggle availability successful')
      } catch (error: any) {
        console.log(`❌ Toggle availability failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }

      // Update Credentials
      console.log('\n3️⃣ UPDATE Credentials:')
      try {
        const credResponse = await api.post(`/radiologists/${firstRadId}/credentials`, {
          npi: '1234567890',
          licenseNumber: 'TEST-12345',
          licenseState: 'CA'
        })
        console.log('✅ Update credentials successful')
      } catch (error: any) {
        console.log(`❌ Update credentials failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`)
      }
    }

    // Summary
    console.log('\n\n📈 CRUD Operations Test Summary')
    console.log('='.repeat(50))
    console.log('\nNOTE: Many operations are failing because:')
    console.log('1. Detail endpoints are not returning data in expected format')
    console.log('2. Some endpoints may not be implemented yet')
    console.log('3. Some operations may require specific permissions or data states')

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testCrudOperations()