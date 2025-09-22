const axios = require('axios');

async function testAPI() {
  console.log('Testing API connectivity...\n');
  
  const baseURL = 'https://api.staging.ajeris.com/api/admin';
  
  try {
    // Test login
    console.log('1. Testing login endpoint...');
    const loginResponse = await axios.post(
      `${baseURL}/auth/login`,
      'username=admin&password=!Ch4ng3Th1sP4ssW0rd!',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Login successful');
    console.log('   Response structure:', JSON.stringify(loginResponse.data, null, 2));
    
    // Try different token locations
    const token = loginResponse.data.data?.token || 
                  loginResponse.data.token || 
                  loginResponse.data.access_token ||
                  loginResponse.data.data?.access_token;
                  
    if (!token) {
      console.error('❌ No token found in response');
      return;
    }
    
    console.log('   Token received:', token.substring(0, 20) + '...');
    const authHeaders = { Authorization: `Bearer ${token}` };
    
    // Test dashboard stats
    console.log('\n2. Testing dashboard stats...');
    const dashboardResponse = await axios.get(`${baseURL}/dashboard/stats`, { headers: authHeaders });
    console.log('✅ Dashboard stats retrieved');
    console.log('   Response:', JSON.stringify(dashboardResponse.data, null, 2));
    
    // Test users list
    console.log('\n3. Testing users list...');
    const usersResponse = await axios.get(`${baseURL}/users?limit=5`, { headers: authHeaders });
    console.log('✅ Users list retrieved');
    console.log('   Response:', JSON.stringify(usersResponse.data, null, 2).substring(0, 500) + '...');
    
    // Test organizations list
    console.log('\n4. Testing organizations list...');
    const orgsResponse = await axios.get(`${baseURL}/organizations?limit=5`, { headers: authHeaders });
    console.log('✅ Organizations list retrieved');
    console.log('   Org count:', orgsResponse.data.data.length);
    
    // Test members list
    console.log('\n5. Testing members list...');
    const membersResponse = await axios.get(`${baseURL}/members?limit=5`, { headers: authHeaders });
    console.log('✅ Members list retrieved');
    console.log('   Member count:', membersResponse.data.data.length);
    
    console.log('\n✅ All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAPI();