#!/usr/bin/env node

import axios from 'axios'

const BASE_URL = 'https://api.staging.ajeris.com'

// Test credentials from backend
const TEST_ACCOUNTS = [
  {
    name: 'Main Test User',
    email: 'yashshah@example.com',
    password: 'Admin123#',
    username: 'yashshah'
  },
  {
    name: 'Admin User',
    email: 'admin@ajeris.com',
    password: 'Admin123#',
    username: 'admin'
  },
  {
    name: 'Default Admin',
    email: 'admin@admin.com',
    password: '!Ch4ng3Th1sP4ssW0rd!',
    username: 'admin'
  }
]

async function testLogin(account: typeof TEST_ACCOUNTS[0]) {
  console.log(`\n🔐 Testing login for: ${account.name}`)
  console.log(`   Email: ${account.email}`)
  
  // Try different endpoint variations
  const endpoints = [
    '/api/admin/auth/login',
    '/api/v1/login',
    '/api/auth/login',
    '/api/login',
    '/auth/login'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n   Trying endpoint: ${endpoint}`)
      
      // Try with email/password
      try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, {
          email: account.email,
          password: account.password
        })
        console.log(`   ✅ Success with email/password!`)
        console.log(`   Response:`, response.data)
        return
      } catch (e: any) {
        if (e.response?.status !== 404) {
          console.log(`   ❌ Failed with email/password: ${e.response?.status} - ${e.response?.data?.message || e.message}`)
          console.log(`   Response data:`, e.response?.data)
        }
      }
      
      // Try with username/password
      try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, {
          username: account.username,
          password: account.password
        })
        console.log(`   ✅ Success with username/password!`)
        console.log(`   Response:`, response.data)
        return
      } catch (e: any) {
        if (e.response?.status !== 404) {
          console.log(`   ❌ Failed with username/password: ${e.response?.status} - ${e.response?.data?.message || e.message}`)
        }
      }
      
    } catch (error: any) {
      // Skip 404s as they just mean the endpoint doesn't exist
      if (error.response?.status !== 404) {
        console.log(`   ❌ Error: ${error.message}`)
      }
    }
  }
}

async function runTests() {
  console.log('🚀 Testing Login Endpoints')
  console.log(`Base URL: ${BASE_URL}`)
  console.log('=' .repeat(50))
  
  for (const account of TEST_ACCOUNTS) {
    await testLogin(account)
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log('✅ Testing complete')
}

runTests().catch(console.error)