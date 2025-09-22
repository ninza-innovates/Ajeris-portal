import { buildApiUrl, API_CONFIG } from './config'
import axios from 'axios'

// Test credentials - will be set dynamically from test page
let TEST_CREDENTIALS = {
  email: 'admin@ajeris.com', // Default, will be overridden
  password: '', // Must be provided by user
}

export function setTestCredentials(email: string, password: string) {
  TEST_CREDENTIALS = { email, password }
}

export async function testApiConnection() {
  console.log('🔍 Testing API Connection...')
  console.log(`Base URL: ${API_CONFIG.BASE_URL}`)
  console.log(`Full URL Pattern: ${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ADMIN_PREFIX}/...`)
  
  // Test 1: Check if API is reachable
  try {
    console.log('\n📡 Test 1: Checking API health...')
    const healthUrl = `${API_CONFIG.BASE_URL}/health`
    const healthResponse = await axios.get(healthUrl, { timeout: 5000 })
    console.log('✅ API is reachable:', healthResponse.status)
  } catch (error: any) {
    console.log('⚠️  Health check failed (this might be normal if /health endpoint doesn\'t exist)')
    console.log('Error:', error.message)
  }

  // Test 2: Test Login Endpoint
  try {
    console.log('\n🔐 Test 2: Testing login endpoint...')
    const loginUrl = buildApiUrl('/auth/login')
    console.log('Login URL:', loginUrl)
    
    const loginResponse = await axios.post(loginUrl, TEST_CREDENTIALS, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
    
    console.log('✅ Login successful!')
    console.log('Response status:', loginResponse.status)
    console.log('Response data:', {
      hasToken: !!loginResponse.data?.token,
      hasUser: !!loginResponse.data?.user,
      userRole: loginResponse.data?.user?.role,
    })
    
    return {
      success: true,
      token: loginResponse.data?.token,
      user: loginResponse.data?.user,
    }
  } catch (error: any) {
    console.log('❌ Login failed!')
    console.log('Error:', error.message)
    if (error.response) {
      console.log('Response status:', error.response.status)
      console.log('Response data:', error.response.data)
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    }
  }
}

// Test specific endpoints that Tim mentioned are ready
export async function testReadyEndpoints(token?: string) {
  const endpoints = [
    { method: 'GET', path: '/dashboard/stats', name: 'Dashboard Stats' },
    { method: 'GET', path: '/users', name: 'List Users' },
    { method: 'GET', path: '/organizations', name: 'List Organizations' },
    { method: 'GET', path: '/radiologists', name: 'List Radiologists' },
    { method: 'GET', path: '/studies', name: 'List Studies' },
  ]

  console.log('\n🧪 Testing ready endpoints...')
  
  const results = []
  
  for (const endpoint of endpoints) {
    const url = buildApiUrl(endpoint.path)
    console.log(`\nTesting ${endpoint.name} (${endpoint.method} ${endpoint.path})`)
    console.log('URL:', url)
    
    try {
      const response = await axios({
        method: endpoint.method,
        url,
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        } : {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      
      console.log('✅ Success:', response.status)
      results.push({
        endpoint: endpoint.name,
        path: endpoint.path,
        success: true,
        status: response.status,
        hasData: !!response.data,
      })
    } catch (error: any) {
      console.log('❌ Failed:', error.message)
      if (error.response) {
        console.log('Response status:', error.response.status)
      }
      results.push({
        endpoint: endpoint.name,
        path: endpoint.path,
        success: false,
        error: error.message,
        status: error.response?.status,
      })
    }
  }
  
  return results
}

// Function to run all tests
export async function runAllTests() {
  console.log('🚀 Starting API Integration Tests\n')
  console.log('=' .repeat(50))
  
  // Test connection and login
  const loginResult = await testApiConnection()
  
  if (loginResult.success && loginResult.token) {
    console.log('\n' + '=' .repeat(50))
    // Test other endpoints with the token
    const endpointResults = await testReadyEndpoints(loginResult.token)
    
    console.log('\n' + '=' .repeat(50))
    console.log('📊 Test Summary:')
    console.log(`Total endpoints tested: ${endpointResults.length}`)
    console.log(`Successful: ${endpointResults.filter(r => r.success).length}`)
    console.log(`Failed: ${endpointResults.filter(r => !r.success).length}`)
    
    console.log('\nDetailed Results:')
    endpointResults.forEach(result => {
      const icon = result.success ? '✅' : '❌'
      console.log(`${icon} ${result.endpoint}: ${result.success ? 'OK' : `Failed (${result.status || 'No response'})`}`)
    })
  } else {
    console.log('\n⚠️  Cannot test other endpoints without successful login')
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log('✨ Tests completed!')
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testApi = runAllTests
  console.log('💡 Tip: Run window.testApi() in the browser console to test the API connection')
}