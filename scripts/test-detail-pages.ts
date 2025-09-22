#!/usr/bin/env npx tsx

import axios from 'axios'

const API_BASE_URL = 'https://api.staging.ajeris.com'
const ADMIN_EMAIL = 'admin@ajeris.com'
const ADMIN_PASSWORD = '!Ch4ng3Th1sP4ssW0rd!'

async function testDetailPages() {
  console.log('🔍 Testing Detail Pages...\n')

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

    // Get IDs from list endpoints
    console.log('📋 Getting IDs from list endpoints...\n')
    
    const ids = {
      user: null as string | null,
      radiologist: null as string | null,
      organization: null as string | null,
      study: null as string | null,
    }

    // Get first user ID
    try {
      const usersResponse = await api.get('/users')
      if (usersResponse.data.data && usersResponse.data.data.length > 0) {
        ids.user = usersResponse.data.data[0].id
        console.log(`✅ Found user ID: ${ids.user}`)
      }
    } catch (e) {
      console.log('❌ Failed to get users')
    }

    // Get first radiologist ID
    try {
      const radResponse = await api.get('/radiologists')
      if (radResponse.data.data && radResponse.data.data.length > 0) {
        ids.radiologist = radResponse.data.data[0].id
        console.log(`✅ Found radiologist ID: ${ids.radiologist}`)
      }
    } catch (e) {
      console.log('❌ Failed to get radiologists')
    }

    // Get first organization ID
    try {
      const orgResponse = await api.get('/organizations')
      if (orgResponse.data.data && orgResponse.data.data.length > 0) {
        ids.organization = orgResponse.data.data[0].id
        console.log(`✅ Found organization ID: ${ids.organization}`)
      }
    } catch (e) {
      console.log('❌ Failed to get organizations')
    }

    // Get first study ID
    try {
      const studyResponse = await api.get('/studies')
      if (studyResponse.data.data && studyResponse.data.data.length > 0) {
        ids.study = studyResponse.data.data[0].id
        console.log(`✅ Found study ID: ${ids.study}`)
      }
    } catch (e) {
      console.log('❌ Failed to get studies')
    }

    console.log('\n📊 Testing Detail Endpoints:\n')

    // Test user detail endpoints
    if (ids.user) {
      console.log(`\n👤 Testing User Details (ID: ${ids.user})`)
      
      const userEndpoints = [
        { name: 'User Detail', path: `/users/${ids.user}` },
        { name: 'User Activity', path: `/users/${ids.user}/activity` },
        { name: 'User Login History', path: `/users/${ids.user}/login-history` },
      ]

      for (const endpoint of userEndpoints) {
        process.stdout.write(`  ${endpoint.name.padEnd(25)} `)
        try {
          const response = await api.get(endpoint.path)
          if (response.data.data !== undefined) {
            console.log('✅ Success')
          } else {
            console.log('❌ No data field')
          }
        } catch (error: any) {
          console.log(`❌ Failed - ${error.response?.status || error.message}`)
        }
      }
    }

    // Test radiologist detail endpoints
    if (ids.radiologist) {
      console.log(`\n🩺 Testing Radiologist Details (ID: ${ids.radiologist})`)
      
      const radEndpoints = [
        { name: 'Radiologist Detail', path: `/radiologists/${ids.radiologist}` },
        { name: 'Radiologist Performance', path: `/radiologists/${ids.radiologist}/performance` },
        { name: 'Radiologist Studies', path: `/radiologists/${ids.radiologist}/studies` },
        { name: 'Radiologist Organizations', path: `/radiologists/${ids.radiologist}/organizations` },
      ]

      for (const endpoint of radEndpoints) {
        process.stdout.write(`  ${endpoint.name.padEnd(25)} `)
        try {
          const response = await api.get(endpoint.path)
          if (response.data.data !== undefined) {
            console.log('✅ Success')
          } else {
            console.log('❌ No data field')
          }
        } catch (error: any) {
          console.log(`❌ Failed - ${error.response?.status || error.message}`)
        }
      }
    }

    // Test organization detail endpoints
    if (ids.organization) {
      console.log(`\n🏢 Testing Organization Details (ID: ${ids.organization})`)
      
      const orgEndpoints = [
        { name: 'Organization Detail', path: `/organizations/${ids.organization}` },
        { name: 'Organization Users', path: `/organizations/${ids.organization}/users` },
        { name: 'Organization Radiologists', path: `/organizations/${ids.organization}/radiologists` },
        { name: 'Organization Settings', path: `/organizations/${ids.organization}/settings` },
        { name: 'Organization Billing', path: `/organizations/${ids.organization}/billing` },
      ]

      for (const endpoint of orgEndpoints) {
        process.stdout.write(`  ${endpoint.name.padEnd(25)} `)
        try {
          const response = await api.get(endpoint.path)
          if (response.data.data !== undefined) {
            console.log('✅ Success')
          } else {
            console.log('❌ No data field')
          }
        } catch (error: any) {
          console.log(`❌ Failed - ${error.response?.status || error.message}`)
        }
      }
    }

    // Test study detail endpoints
    if (ids.study) {
      console.log(`\n📄 Testing Study Details (ID: ${ids.study})`)
      
      const studyEndpoints = [
        { name: 'Study Detail', path: `/studies/${ids.study}` },
        { name: 'Study Files', path: `/studies/${ids.study}/files` },
        { name: 'Study Audit Log', path: `/studies/${ids.study}/audit` },
      ]

      for (const endpoint of studyEndpoints) {
        process.stdout.write(`  ${endpoint.name.padEnd(25)} `)
        try {
          const response = await api.get(endpoint.path)
          if (response.data.data !== undefined) {
            console.log('✅ Success')
          } else {
            console.log('❌ No data field')
          }
        } catch (error: any) {
          console.log(`❌ Failed - ${error.response?.status || error.message}`)
        }
      }
    }

  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testDetailPages()