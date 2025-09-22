#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function testPagination() {
  console.log('🔍 Testing Pagination on List Endpoints...\n')

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

    // Test pagination for each list endpoint
    const endpoints = [
      { name: 'Users', path: '/users' },
      { name: 'Radiologists', path: '/radiologists' },
      { name: 'Organizations', path: '/organizations' },
      { name: 'Studies', path: '/studies' },
    ]

    for (const endpoint of endpoints) {
      console.log(`\n📊 Testing ${endpoint.name} Pagination`)
      console.log('='.repeat(50))
      
      // Test default page
      try {
        console.log('\n1️⃣ Default Request (no params):')
        const defaultResponse = await api.get(endpoint.path)
        const defaultData = defaultResponse.data
        
        if (defaultData.data && defaultData.meta) {
          console.log(`   ✅ Items: ${defaultData.data.length}`)
          console.log(`   📄 Meta:`, JSON.stringify(defaultData.meta, null, 2))
        } else {
          console.log(`   ❌ Missing data or meta field`)
        }
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.response?.status || error.message}`)
      }

      // Test with page and limit params
      try {
        console.log('\n2️⃣ Page 1, Limit 2:')
        const page1Response = await api.get(endpoint.path, {
          params: { page: 1, limit: 2 }
        })
        const page1Data = page1Response.data
        
        if (page1Data.data && page1Data.meta) {
          console.log(`   ✅ Items: ${page1Data.data.length}`)
          console.log(`   📄 Meta:`, JSON.stringify(page1Data.meta, null, 2))
          
          // Test if hasMore is working
          if (page1Data.meta.total > 2) {
            console.log(`   ✅ hasMore should be true: ${page1Data.meta.hasMore === true ? 'YES' : 'NO'}`)
          }
        } else {
          console.log(`   ❌ Missing data or meta field`)
        }
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.response?.status || error.message}`)
      }

      // Test page 2 if there's more data
      try {
        console.log('\n3️⃣ Page 2, Limit 2:')
        const page2Response = await api.get(endpoint.path, {
          params: { page: 2, limit: 2 }
        })
        const page2Data = page2Response.data
        
        if (page2Data.data && page2Data.meta) {
          console.log(`   ✅ Items: ${page2Data.data.length}`)
          console.log(`   📄 Meta:`, JSON.stringify(page2Data.meta, null, 2))
        } else {
          console.log(`   ❌ Missing data or meta field`)
        }
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.response?.status || error.message}`)
      }

      // Test with search/filter params
      try {
        console.log('\n4️⃣ With Search Filter:')
        const searchResponse = await api.get(endpoint.path, {
          params: { search: 'test', page: 1, limit: 10 }
        })
        const searchData = searchResponse.data
        
        if (searchData.data && searchData.meta) {
          console.log(`   ✅ Items found: ${searchData.data.length}`)
          console.log(`   📄 Meta:`, JSON.stringify(searchData.meta, null, 2))
        } else {
          console.log(`   ❌ Missing data or meta field`)
        }
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.response?.status || error.message}`)
      }

      // Test invalid page
      try {
        console.log('\n5️⃣ Invalid Page (999):')
        const invalidResponse = await api.get(endpoint.path, {
          params: { page: 999, limit: 10 }
        })
        const invalidData = invalidResponse.data
        
        if (invalidData.data && invalidData.meta) {
          console.log(`   ✅ Items: ${invalidData.data.length} (should be 0)`)
          console.log(`   📄 Meta:`, JSON.stringify(invalidData.meta, null, 2))
        } else {
          console.log(`   ❌ Missing data or meta field`)
        }
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.response?.status || error.message}`)
      }
    }

    // Summary
    console.log('\n\n📈 Pagination Test Summary')
    console.log('='.repeat(50))
    console.log('\n✅ Expected behavior for proper pagination:')
    console.log('   - Meta object includes: page, limit, total, hasMore')
    console.log('   - Page parameter controls which page of results')
    console.log('   - Limit parameter controls items per page')
    console.log('   - hasMore indicates if there are more pages')
    console.log('   - Empty array returned for pages beyond available data')
    console.log('   - Search/filter parameters work with pagination')

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testPagination()