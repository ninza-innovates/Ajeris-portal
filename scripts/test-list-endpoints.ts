#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function testListEndpoints() {
  console.log('🔍 Testing List Endpoints...\n')

  try {
    // Login first
    console.log('Logging in...')
    const loginResponse = await axios.post(`${API_BASE_URL}/api/admin/auth/login`, {
      username: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const { access_token } = loginResponse.data
    console.log('✅ Login successful\n')

    // Configure axios with auth token
    const api = axios.create({
      baseURL: `${API_BASE_URL}/api/admin`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Test endpoints
    const endpoints = [
      { name: 'Users', path: '/users' },
      { name: 'Radiologists', path: '/radiologists' },
      { name: 'Organizations', path: '/organizations' },
      { name: 'Studies', path: '/studies' },
    ]

    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint.name} list endpoint: ${endpoint.path}`)
      try {
        const response = await api.get(endpoint.path)
        const data = response.data
        
        // Check if response has expected structure
        if (data.data && Array.isArray(data.data)) {
          console.log(`✅ ${endpoint.name}: Success - Found ${data.data.length} items`)
          if (data.meta) {
            console.log(`   Meta: Total=${data.meta.total}, Page=${data.meta.page}, Limit=${data.meta.limit}`)
          }
        } else {
          console.log(`⚠️  ${endpoint.name}: Unexpected response structure`, JSON.stringify(data).slice(0, 100))
        }
      } catch (error: any) {
        console.log(`❌ ${endpoint.name}: Failed - ${error.response?.status || error.message}`)
        if (error.response?.data) {
          console.log(`   Error: ${JSON.stringify(error.response.data).slice(0, 100)}`)
        }
      }
      console.log()
    }

    // Test some detail endpoints with IDs from list responses
    console.log('\n📋 Testing Detail Endpoints...\n')

    // Test user detail if we have users
    try {
      const usersResponse = await api.get('/users')
      if (usersResponse.data.data && usersResponse.data.data.length > 0) {
        const firstUserId = usersResponse.data.data[0].id
        console.log(`Testing user detail: /users/${firstUserId}`)
        const userDetail = await api.get(`/users/${firstUserId}`)
        console.log(`✅ User detail: Success - ${userDetail.data.data?.name || 'No name'}`)
      }
    } catch (error: any) {
      console.log(`❌ User detail: Failed - ${error.response?.status || error.message}`)
    }

    // Test radiologist detail if we have radiologists
    try {
      const radResponse = await api.get('/radiologists')
      if (radResponse.data.data && radResponse.data.data.length > 0) {
        const firstRadId = radResponse.data.data[0].id
        console.log(`Testing radiologist detail: /radiologists/${firstRadId}`)
        const radDetail = await api.get(`/radiologists/${firstRadId}`)
        console.log(`✅ Radiologist detail: Success - ${radDetail.data.data?.name || 'No name'}`)
      }
    } catch (error: any) {
      console.log(`❌ Radiologist detail: Failed - ${error.response?.status || error.message}`)
    }

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testListEndpoints()