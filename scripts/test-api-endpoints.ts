#!/usr/bin/env node

/**
 * Script to test API endpoints connectivity and basic CRUD operations
 * Run with: npx tsx scripts/test-api-endpoints.ts
 */

import axios from 'axios'
import { API_CONFIG } from '../src/lib/api/config'

const API_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ADMIN_PREFIX}`

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

// Test credentials from Tim
const TEST_CREDENTIALS = {
  username: 'admin',  // Note: using username, not email
  password: '!Ch4ng3Th1sP4ssW0rd!'
}

interface TestResult {
  endpoint: string
  method: string
  status: 'success' | 'failure' | 'skipped'
  message?: string
  data?: any
}

const results: TestResult[] = []

async function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function testEndpoint(
  method: string,
  path: string,
  data?: any,
  description?: string,
  config?: any
): Promise<TestResult> {
  const endpoint = `${API_BASE}${path}`
  const desc = description || `${method} ${path}`
  
  try {
    log(`Testing: ${desc}...`, colors.blue)
    
    const response = await axios({
      method,
      url: endpoint,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(global.authToken ? { 'Authorization': `Bearer ${global.authToken}` } : {}),
        ...(config?.headers || {})
      }
    })
    
    log(`✅ Success: ${desc}`, colors.green)
    return {
      endpoint: path,
      method,
      status: 'success',
      data: response.data
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message
    log(`❌ Failed: ${desc} - ${message}`, colors.red)
    return {
      endpoint: path,
      method,
      status: 'failure',
      message
    }
  }
}

async function runTests() {
  log('🚀 Starting API Endpoint Tests', colors.yellow)
  log(`Base URL: ${API_BASE}`, colors.blue)
  log('=' .repeat(50))

  // Test 1: Login (using form data)
  log('\n📋 Testing Authentication', colors.yellow)
  const params = new URLSearchParams()
  params.append('username', TEST_CREDENTIALS.username)
  params.append('password', TEST_CREDENTIALS.password)
  
  const loginResult = await testEndpoint('POST', '/auth/login', params.toString(), 'Login', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  
  if (loginResult.status === 'success' && loginResult.data?.access_token) {
    global.authToken = loginResult.data.access_token
    log('✅ Authentication successful, token obtained', colors.green)
  } else {
    log('❌ Authentication failed, skipping protected endpoints', colors.red)
    return
  }

  // Test 2: Dashboard Stats
  log('\n📊 Testing Dashboard', colors.yellow)
  await testEndpoint('GET', '/dashboard/stats', null, 'Dashboard Stats')

  // Test 3: Users Endpoints
  log('\n👥 Testing User Management', colors.yellow)
  const usersResult = await testEndpoint('GET', '/users?page=1&limit=10', null, 'List Users')
  
  if (usersResult.status === 'success' && usersResult.data?.data?.length > 0) {
    const userId = usersResult.data.data[0].id
    await testEndpoint('GET', `/users/${userId}`, null, 'Get User Details')
  }

  // Test 4: Organizations Endpoints
  log('\n🏢 Testing Organizations', colors.yellow)
  const orgsResult = await testEndpoint('GET', '/organizations?page=1&limit=10', null, 'List Organizations')
  
  if (orgsResult.status === 'success' && orgsResult.data?.data?.length > 0) {
    const orgId = orgsResult.data.data[0].id
    await testEndpoint('GET', `/organizations/${orgId}`, null, 'Get Organization Details')
    await testEndpoint('GET', `/organizations/${orgId}/users`, null, 'Get Organization Users')
  }

  // Test 5: Radiologists Endpoints
  log('\n👨‍⚕️ Testing Radiologists', colors.yellow)
  const radResult = await testEndpoint('GET', '/radiologists?page=1&limit=10', null, 'List Radiologists')
  
  if (radResult.status === 'success' && radResult.data?.data?.length > 0) {
    const radId = radResult.data.data[0].id
    await testEndpoint('GET', `/radiologists/${radId}`, null, 'Get Radiologist Details')
    await testEndpoint('GET', `/radiologists/${radId}/performance`, null, 'Get Radiologist Performance')
  }

  // Test 6: Studies Endpoints
  log('\n📑 Testing Studies', colors.yellow)
  const studiesResult = await testEndpoint('GET', '/studies?page=1&limit=10', null, 'List Studies')
  
  if (studiesResult.status === 'success' && studiesResult.data?.data?.length > 0) {
    const studyId = studiesResult.data.data[0].id
    await testEndpoint('GET', `/studies/${studyId}`, null, 'Get Study Details')
  }

  // Test 7: Logout
  log('\n🔚 Testing Logout', colors.yellow)
  await testEndpoint('POST', '/auth/logout', null, 'Logout')

  // Summary
  log('\n' + '=' .repeat(50))
  log('📈 Test Summary', colors.yellow)
  const successful = results.filter(r => r.status === 'success').length
  const failed = results.filter(r => r.status === 'failure').length
  
  log(`✅ Successful: ${successful}`, colors.green)
  log(`❌ Failed: ${failed}`, colors.red)
  
  if (failed > 0) {
    log('\n❌ Failed Endpoints:', colors.red)
    results.filter(r => r.status === 'failure').forEach(r => {
      log(`  - ${r.method} ${r.endpoint}: ${r.message}`, colors.red)
    })
  }
}

// Global auth token
declare global {
  var authToken: string | undefined
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, colors.red)
  process.exit(1)
})