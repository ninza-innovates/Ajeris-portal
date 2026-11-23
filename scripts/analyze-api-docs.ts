#!/usr/bin/env npx tsx

import axios from 'axios'
import { groupAdminEndpoints, httpMethodList, parseOpenApiPaths } from './openapi-document'

const API_BASE_URL = 'https://api.staging.ajeris.com'

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unknown error'
}

async function analyzeApiDocs() {
  console.log('🔍 Fetching API Documentation...\n')

  try {
    // Try to fetch OpenAPI spec
    console.log('Fetching OpenAPI specification...')
    const response = await axios.get<unknown>(`${API_BASE_URL}/openapi.json`)
    const paths = parseOpenApiPaths(response.data)
    const adminEndpoints = groupAdminEndpoints(paths)

    console.log('✅ OpenAPI spec fetched successfully\n')

    // Print organized endpoints
    console.log('📋 ADMIN API ENDPOINTS BY CATEGORY')
    console.log('='.repeat(80))

    Object.entries(adminEndpoints).forEach(([category, endpoints]) => {
      console.log(`\n📁 ${category.toUpperCase()}`)
      console.log('-'.repeat(40))

      endpoints.sort((a, b) => a.path.localeCompare(b.path))

      endpoints.forEach((endpoint) => {
        console.log(`${endpoint.method.padEnd(7)} ${endpoint.path}`)
        if (endpoint.summary) {
          console.log(`        ${endpoint.summary}`)
        }
      })
    })

    // Look for specific endpoints we need
    console.log('\n\n🔍 CHECKING FOR SPECIFIC FEATURES')
    console.log('='.repeat(80))

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
      'logs',
    ]

    featuresToCheck.forEach((feature) => {
      const found = Object.entries(paths).filter(
        ([path]) => path.includes('/admin/') && path.toLowerCase().includes(feature)
      )

      console.log(`\n${feature.toUpperCase()}: ${found.length > 0 ? '✅ Found' : '❌ Not found'}`)
      found.forEach(([path, pathItem]) => {
        console.log(`  - ${path} [${httpMethodList(pathItem)}]`)
      })
    })

    // Summary statistics
    const totalAdminEndpoints = Object.values(adminEndpoints).reduce(
      (sum, endpoints) => sum + endpoints.length,
      0
    )
    console.log('\n\n📊 SUMMARY')
    console.log('='.repeat(80))
    console.log(`Total admin endpoints: ${totalAdminEndpoints}`)
    console.log(`Categories: ${Object.keys(adminEndpoints).length}`)
    console.log(`\nCategories found: ${Object.keys(adminEndpoints).join(', ')}`)
  } catch (error: unknown) {
    console.error('Failed to fetch API documentation:', describeError(error))

    // Try alternate endpoints
    console.log('\nTrying alternate documentation endpoints...')

    const alternates = [
      '/docs',
      '/api/docs',
      '/api/openapi.json',
      '/api/admin/docs',
      '/swagger.json',
      '/api/swagger.json',
    ]

    for (const alt of alternates) {
      try {
        console.log(`Trying ${API_BASE_URL}${alt}...`)
        await axios.get<unknown>(`${API_BASE_URL}${alt}`)
        console.log(`✅ Found documentation at ${alt}`)
        break
      } catch {
        console.log(`❌ Not found at ${alt}`)
      }
    }
  }
}

analyzeApiDocs()
