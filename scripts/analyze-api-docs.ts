#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'

async function analyzeApiDocs() {
  console.log('🔍 Fetching API Documentation...\n')

  try {
    // Try to fetch OpenAPI spec
    console.log('Fetching OpenAPI specification...')
    const response = await axios.get(`${API_BASE_URL}/openapi.json`)
    const openapi = response.data

    console.log('✅ OpenAPI spec fetched successfully\n')

    // Analyze admin endpoints
    const adminEndpoints: any = {}
    const paths = openapi.paths || {}

    // Group endpoints by category
    Object.entries(paths).forEach(([path, methods]: [string, any]) => {
      if (path.includes('/admin/')) {
        // Extract category from path
        const pathParts = path.split('/')
        const adminIndex = pathParts.indexOf('admin')
        const category = pathParts[adminIndex + 1] || 'general'

        if (!adminEndpoints[category]) {
          adminEndpoints[category] = []
        }

        // Add each method for this path
        Object.entries(methods).forEach(([method, details]: [string, any]) => {
          if (method !== 'parameters') {
            adminEndpoints[category].push({
              path,
              method: method.toUpperCase(),
              summary: details.summary || '',
              operationId: details.operationId || '',
              tags: details.tags || [],
              parameters: details.parameters || [],
              requestBody: details.requestBody ? true : false
            })
          }
        })
      }
    })

    // Print organized endpoints
    console.log('📋 ADMIN API ENDPOINTS BY CATEGORY')
    console.log('=' .repeat(80))

    Object.entries(adminEndpoints).forEach(([category, endpoints]: [string, any]) => {
      console.log(`\n📁 ${category.toUpperCase()}`)
      console.log('-'.repeat(40))
      
      endpoints.sort((a: any, b: any) => a.path.localeCompare(b.path))
      
      endpoints.forEach((endpoint: any) => {
        console.log(`${endpoint.method.padEnd(7)} ${endpoint.path}`)
        if (endpoint.summary) {
          console.log(`        ${endpoint.summary}`)
        }
      })
    })

    // Look for specific endpoints we need
    console.log('\n\n🔍 CHECKING FOR SPECIFIC FEATURES')
    console.log('=' .repeat(80))

    const featuresToCheck = [
      'settings',
      'reports',
      'compliance',
      'notifications',
      'onboarding',
      'billing',
      'credentialing',
      'system',
      'audit',
      'logs'
    ]

    featuresToCheck.forEach(feature => {
      const found = Object.entries(paths).filter(([path]) => 
        path.includes(`/admin/`) && path.toLowerCase().includes(feature)
      )
      
      console.log(`\n${feature.toUpperCase()}: ${found.length > 0 ? '✅ Found' : '❌ Not found'}`)
      if (found.length > 0) {
        found.forEach(([path, methods]) => {
          const methodList = Object.keys(methods).filter(m => m !== 'parameters').map(m => m.toUpperCase()).join(', ')
          console.log(`  - ${path} [${methodList}]`)
        })
      }
    })

    // Summary statistics
    const totalAdminEndpoints = Object.values(adminEndpoints).reduce((sum: number, endpoints: any) => sum + endpoints.length, 0)
    console.log('\n\n📊 SUMMARY')
    console.log('=' .repeat(80))
    console.log(`Total admin endpoints: ${totalAdminEndpoints}`)
    console.log(`Categories: ${Object.keys(adminEndpoints).length}`)
    console.log(`\nCategories found: ${Object.keys(adminEndpoints).join(', ')}`)

  } catch (error: any) {
    console.error('Failed to fetch API documentation:', error.message)
    
    // Try alternate endpoints
    console.log('\nTrying alternate documentation endpoints...')
    
    const alternates = [
      '/docs',
      '/api/docs',
      '/api/openapi.json',
      '/api/admin/docs',
      '/swagger.json',
      '/api/swagger.json'
    ]

    for (const alt of alternates) {
      try {
        console.log(`Trying ${API_BASE_URL}${alt}...`)
        const response = await axios.get(`${API_BASE_URL}${alt}`)
        console.log(`✅ Found documentation at ${alt}`)
        break
      } catch (e) {
        console.log(`❌ Not found at ${alt}`)
      }
    }
  }
}

analyzeApiDocs()