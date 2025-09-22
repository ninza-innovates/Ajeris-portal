#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function checkResponseFormat() {
  console.log('🔍 Checking actual response format...\n')

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

    // Check raw response format for each endpoint
    const endpoints = ['/users', '/radiologists', '/organizations', '/studies']

    for (const endpoint of endpoints) {
      console.log(`\n📊 Checking ${endpoint} response format:`)
      console.log('='.repeat(50))
      
      try {
        const response = await api.get(endpoint, {
          params: { page: 1, limit: 2 }
        })
        
        console.log('Raw response structure:')
        console.log(JSON.stringify(response.data, null, 2))
        
        // Check what fields are present
        console.log('\nResponse analysis:')
        console.log(`- Has 'data' field: ${response.data.data !== undefined}`)
        console.log(`- Has 'meta' field: ${response.data.meta !== undefined}`)
        console.log(`- Has 'success' field: ${response.data.success !== undefined}`)
        console.log(`- Response is array: ${Array.isArray(response.data)}`)
        console.log(`- Response.data is array: ${Array.isArray(response.data.data)}`)
        
      } catch (error: any) {
        console.log(`❌ Error: ${error.response?.status || error.message}`)
        if (error.response?.data) {
          console.log('Error response:', JSON.stringify(error.response.data, null, 2))
        }
      }
    }

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

checkResponseFormat()