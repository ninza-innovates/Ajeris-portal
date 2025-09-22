#!/usr/bin/env node

import axios from 'axios'

const BASE_URL = 'https://api.staging.ajeris.com'

// Test credentials from backend
const TEST_ACCOUNT = {
  email: 'admin@admin.com',
  password: '!Ch4ng3Th1sP4ssW0rd!'
}

async function testLoginWithFormData() {
  console.log('🔐 Testing admin login with form data')
  console.log(`   Email: ${TEST_ACCOUNT.email}`)
  
  try {
    const params = new URLSearchParams()
    params.append('username', TEST_ACCOUNT.email)
    params.append('password', TEST_ACCOUNT.password)
    
    console.log('\n📤 Request:')
    console.log(`   URL: ${BASE_URL}/api/admin/auth/login`)
    console.log(`   Method: POST`)
    console.log(`   Content-Type: application/x-www-form-urlencoded`)
    console.log(`   Body: ${params.toString()}`)
    
    const response = await axios.post(
      `${BASE_URL}/api/admin/auth/login`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    
    console.log('\n✅ Success!')
    console.log('📥 Response:')
    console.log(JSON.stringify(response.data, null, 2))
    
    if (response.data.access_token) {
      console.log('\n🎉 Login successful! Token received.')
      console.log(`   Token: ${response.data.access_token.substring(0, 50)}...`)
      console.log(`   Type: ${response.data.token_type}`)
    }
    
  } catch (error: any) {
    console.log('\n❌ Login failed!')
    if (error.response) {
      console.log(`   Status: ${error.response.status}`)
      console.log(`   Response:`, error.response.data)
    } else {
      console.log(`   Error: ${error.message}`)
    }
  }
}

testLoginWithFormData()