#!/usr/bin/env node

import axios from 'axios'

const BASE_URL = 'https://api.staging.ajeris.com'

// Credentials from Tim
const ADMIN_CREDENTIALS = {
  email: 'admin@ajeris.com',
  username: 'admin',
  password: '!Ch4ng3Th1sP4ssW0rd!'
}

async function testAdminLogin() {
  console.log('🔐 Testing admin login with Tim\'s credentials')
  console.log(`   Email: ${ADMIN_CREDENTIALS.email}`)
  console.log(`   Username: ${ADMIN_CREDENTIALS.username}`)
  
  try {
    // Try with username
    console.log('\n📤 Trying with username...')
    const params = new URLSearchParams()
    params.append('username', ADMIN_CREDENTIALS.username)
    params.append('password', ADMIN_CREDENTIALS.password)
    
    const response = await axios.post(
      `${BASE_URL}/api/admin/auth/login`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    
    console.log('\n✅ Login successful!')
    console.log('📥 Response:')
    console.log(JSON.stringify(response.data, null, 2))
    
    if (response.data.access_token) {
      console.log('\n🎉 Token received!')
      console.log(`   Token: ${response.data.access_token.substring(0, 50)}...`)
      console.log(`   Type: ${response.data.token_type}`)
      
      // Test an authenticated endpoint
      console.log('\n🧪 Testing authenticated endpoint...')
      try {
        const dashboardResponse = await axios.get(
          `${BASE_URL}/api/admin/dashboard/stats`,
          {
            headers: {
              'Authorization': `${response.data.token_type} ${response.data.access_token}`
            }
          }
        )
        console.log('✅ Dashboard stats accessible!')
        console.log('📊 Stats:', JSON.stringify(dashboardResponse.data, null, 2))
      } catch (e: any) {
        console.log('❌ Dashboard stats failed:', e.response?.status, e.response?.data)
      }
    }
    
  } catch (error: any) {
    console.log('\n❌ Login with username failed!')
    console.log(`   Status: ${error.response?.status}`)
    console.log(`   Response:`, error.response?.data)
    
    // Try with email
    console.log('\n📤 Trying with email...')
    try {
      const params2 = new URLSearchParams()
      params2.append('username', ADMIN_CREDENTIALS.email)
      params2.append('password', ADMIN_CREDENTIALS.password)
      
      const response2 = await axios.post(
        `${BASE_URL}/api/admin/auth/login`,
        params2.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      
      console.log('\n✅ Login with email successful!')
      console.log('📥 Response:', JSON.stringify(response2.data, null, 2))
    } catch (e: any) {
      console.log('❌ Login with email also failed!')
      console.log(`   Status: ${e.response?.status}`)
      console.log(`   Response:`, e.response?.data)
    }
  }
}

testAdminLogin()