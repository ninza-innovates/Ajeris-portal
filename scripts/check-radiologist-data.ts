#!/usr/bin/env node

import axios from 'axios'

const BASE_URL = 'https://api.staging.ajeris.com'

async function checkRadiologistData() {
  try {
    // Login first
    const params = new URLSearchParams()
    params.append('username', 'admin')
    params.append('password', '!Ch4ng3Th1sP4ssW0rd!')
    
    const loginResponse = await axios.post(
      `${BASE_URL}/api/admin/auth/login`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    
    const token = loginResponse.data.access_token
    
    // Get radiologists
    const response = await axios.get(
      `${BASE_URL}/api/admin/radiologists?page=1&limit=2`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    
    console.log('Radiologists Response Structure:')
    console.log(JSON.stringify(response.data, null, 2))
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\nFirst Radiologist Object:')
      console.log(JSON.stringify(response.data.data[0], null, 2))
      
      console.log('\nAvailable fields:')
      console.log(Object.keys(response.data.data[0]))
    }
    
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message)
  }
}

checkRadiologistData()