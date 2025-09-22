#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function testPaginationV2() {
  console.log('🔍 Testing Pagination with Mapped Response Format...\n')

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

    // Test users endpoint with different pagination scenarios
    const testCases = [
      { name: 'Page 1, Limit 1', params: { page: 1, limit: 1 } },
      { name: 'Page 2, Limit 1', params: { page: 2, limit: 1 } },
      { name: 'Page 3, Limit 1', params: { page: 3, limit: 1 } },
      { name: 'Page 1, Limit 5', params: { page: 1, limit: 5 } },
      { name: 'Invalid Page', params: { page: 999, limit: 10 } }
    ]

    console.log('📊 Testing Users Endpoint Pagination')
    console.log('='.repeat(50))
    
    for (const test of testCases) {
      console.log(`\n${test.name}:`)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          params: test.params,
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        })
        
        const data = response.data
        console.log(`✅ Success`)
        console.log(`   Items returned: ${data.data?.length || 0}`)
        console.log(`   Total count: ${data.total_count}`)
        console.log(`   Has more: ${data.has_more}`)
        console.log(`   Page: ${data.page}`)
        console.log(`   Items per page: ${data.items_per_page}`)
        
        if (data.data && data.data.length > 0) {
          console.log(`   First item: ${data.data[0].name || data.data[0].email}`)
        }
      } catch (error: any) {
        console.log(`❌ Failed: ${error.response?.status || error.message}`)
      }
    }

    // Test other endpoints briefly
    console.log('\n\n📊 Quick Test of Other Endpoints')
    console.log('='.repeat(50))
    
    const endpoints = [
      { name: 'Radiologists', path: '/radiologists' },
      { name: 'Organizations', path: '/organizations' },
      { name: 'Studies', path: '/studies' }
    ]

    for (const endpoint of endpoints) {
      console.log(`\n${endpoint.name}:`)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin${endpoint.path}`, {
          params: { page: 1, limit: 2 },
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        })
        
        const data = response.data
        console.log(`✅ Success - ${data.data?.length || 0} items, total: ${data.total_count}`)
      } catch (error: any) {
        console.log(`❌ Failed: ${error.response?.status || error.message}`)
      }
    }

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testPaginationV2()