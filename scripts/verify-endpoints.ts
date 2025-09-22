#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function verifyEndpoints() {
  console.log('🔍 Verifying API Endpoints...\n')

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

    // Test endpoints
    const endpoints = [
      { name: 'Dashboard Stats', path: '/dashboard/stats' },
      { name: 'Users List', path: '/users' },
      { name: 'User Stats', path: '/users/stats' },
      { name: 'Radiologists List', path: '/radiologists' },
      { name: 'Radiologist Stats', path: '/radiologists/stats' },
      { name: 'Organizations List', path: '/organizations' },
      { name: 'Organization Stats', path: '/organizations/stats' },
      { name: 'Studies List', path: '/studies' },
      { name: 'Study Stats', path: '/studies/stats' },
    ]

    console.log('📊 Testing Endpoints:\n')
    
    const results = {
      working: [] as string[],
      failing: [] as string[],
      empty: [] as string[]
    }

    for (const endpoint of endpoints) {
      process.stdout.write(`${endpoint.name.padEnd(25)} ${endpoint.path.padEnd(30)} `)
      try {
        const response = await api.get(endpoint.path)
        const data = response.data
        
        // Check response structure
        if (data.data !== undefined) {
          if (Array.isArray(data.data) && data.data.length === 0) {
            console.log('⚠️  Empty array')
            results.empty.push(endpoint.path)
          } else if (Array.isArray(data.data) && data.data.length > 0) {
            console.log(`✅ Success - ${data.data.length} items`)
            results.working.push(endpoint.path)
          } else if (typeof data.data === 'object') {
            console.log('✅ Success - Object data')
            results.working.push(endpoint.path)
          } else {
            console.log('⚠️  Unexpected data type')
            results.empty.push(endpoint.path)
          }
        } else {
          console.log('❌ No data field in response')
          results.failing.push(endpoint.path)
        }
      } catch (error: any) {
        console.log(`❌ Failed - ${error.response?.status || error.message}`)
        results.failing.push(endpoint.path)
      }
    }

    // Summary
    console.log('\n📈 Summary:')
    console.log(`✅ Working endpoints: ${results.working.length}`)
    results.working.forEach(ep => console.log(`   - ${ep}`))
    
    console.log(`\n⚠️  Empty responses: ${results.empty.length}`)
    results.empty.forEach(ep => console.log(`   - ${ep}`))
    
    console.log(`\n❌ Failing endpoints: ${results.failing.length}`)
    results.failing.forEach(ep => console.log(`   - ${ep}`))

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

verifyEndpoints()