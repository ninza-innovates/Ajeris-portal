#!/usr/bin/env tsx

/**
 * API Integration Test Script
 * Run with: npx tsx src/scripts/test-api-integrations.ts
 */

import { apiClient } from '../lib/api/client'
import { OrganizationsService } from '../lib/api/services/organizations.service'
import { UsersService } from '../lib/api/services/users.service'
import { RadiologyService } from '../lib/api/services/radiology.service'
import { StudiesService } from '../lib/api/services/studies.service'
import { SystemService } from '../lib/api/services/system.service'
import { ComplianceService } from '../lib/api/services/compliance.service'
import { ReportsService } from '../lib/api/services/reports.service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.staging.ajeris.com'

console.log('🧪 Testing API Integrations...')
console.log(`📍 API Base URL: ${API_BASE_URL}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

interface TestResult {
  endpoint: string
  method: string
  status: 'success' | 'error'
  message: string
  responseTime?: number
}

const results: TestResult[] = []

async function testEndpoint(
  name: string,
  method: string,
  testFn: () => Promise<any>
): Promise<void> {
  const startTime = Date.now()
  
  try {
    const response = await testFn()
    const responseTime = Date.now() - startTime
    
    results.push({
      endpoint: name,
      method,
      status: 'success',
      message: `✅ Success (${responseTime}ms)`,
      responseTime
    })
    
    console.log(`✅ ${method} ${name} - Success (${responseTime}ms)`)
    
    // Log sample data if available
    if (response?.data) {
      const sampleData = Array.isArray(response.data) 
        ? `${response.data.length} items returned`
        : 'Data returned'
      console.log(`   └─ ${sampleData}`)
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    
    results.push({
      endpoint: name,
      method,
      status: 'error',
      message: `❌ ${errorMessage}`,
      responseTime
    })
    
    console.log(`❌ ${method} ${name} - Error: ${errorMessage}`)
  }
  
  console.log('')
}

async function runTests() {
  // Test Organizations
  console.log('📁 Testing Organizations Service...')
  await testEndpoint('/api/organizations', 'GET', () => 
    OrganizationsService.getOrganizations()
  )
  await testEndpoint('/api/organizations/stats', 'GET', () => 
    OrganizationsService.getStats()
  )
  
  // Test Users
  console.log('👤 Testing Users Service...')
  await testEndpoint('/api/users', 'GET', () => 
    UsersService.getUsers()
  )
  await testEndpoint('/api/users/stats', 'GET', () => 
    UsersService.getStats()
  )
  
  // Test Radiologists
  console.log('🩺 Testing Radiology Service...')
  await testEndpoint('/api/radiologists', 'GET', () => 
    RadiologyService.getRadiologists()
  )
  await testEndpoint('/api/radiologists/stats', 'GET', () => 
    RadiologyService.getStats()
  )
  
  // Test Studies
  console.log('📊 Testing Studies Service...')
  await testEndpoint('/api/studies', 'GET', () => 
    StudiesService.getStudies()
  )
  await testEndpoint('/api/studies/stats', 'GET', () => 
    StudiesService.getStats()
  )
  
  // Test System
  console.log('⚙️ Testing System Service...')
  await testEndpoint('/api/system/settings', 'GET', () => 
    SystemService.getSettings()
  )
  await testEndpoint('/api/system/health', 'GET', () => 
    SystemService.getHealth()
  )
  
  // Test Compliance
  console.log('🛡️ Testing Compliance Service...')
  await testEndpoint('/api/compliance/audit-logs', 'GET', () => 
    ComplianceService.getAuditLogs()
  )
  
  // Test Reports
  console.log('📈 Testing Reports Service...')
  await testEndpoint('/api/reports/types', 'GET', () => 
    ReportsService.getReportTypes()
  )
  await testEndpoint('/api/reports/generated', 'GET', () => 
    ReportsService.getGeneratedReports()
  )
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Test Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const avgResponseTime = Math.round(
    results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length
  )
  
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${errorCount}`)
  console.log(`⏱️  Average Response Time: ${avgResponseTime}ms`)
  
  if (errorCount > 0) {
    console.log('\n❌ Failed Endpoints:')
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`   - ${r.method} ${r.endpoint}: ${r.message}`)
      })
  }
  
  // Check for missing endpoints
  console.log('\n⚠️  Known Missing Endpoints (from api-issues-for-tim.md):')
  const missingEndpoints = [
    'POST /api/organizations/:id/test-hl7',
    'POST /api/users/:id/send-password-reset',
    'POST /api/reports/generate',
    'GET /api/credentialing/*',
    'WebSocket /api/notifications',
  ]
  
  missingEndpoints.forEach(endpoint => {
    console.log(`   - ${endpoint}`)
  })
  
  console.log('\n💡 Recommendation: Update api-issues-for-tim.md with any new findings')
}

// Run the tests
runTests().catch(console.error)