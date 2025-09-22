// Test the case conversion utilities

function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeysSnakeToCamel(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysSnakeToCamel(item))
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted = {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = snakeToCamel(key)
        converted[camelKey] = convertKeysSnakeToCamel(obj[key])
      }
    }
    
    return converted
  }

  return obj
}

// Test data from API
const dashboardStats = {
  "total_studies": 19,
  "active_radiologists": 20,
  "organizations": 10,
  "monthly_volume": 10,
  "revenue": 0,
  "tat_compliance": 0,
  "studies_by_status": {
    "RECEIVED": 16,
    "READY": 0,
    "REPORTING": 0,
    "FINAL": 3
  },
  "recent_activity": []
}

const user = {
  "id": 58,
  "name": "Test User2",
  "username": "test2",
  "email": "test2@kaziflex.com",
  "profile_image_url": null,
  "role": "CLINIC",
  "created_at": "2025-08-05T10:03:23.735949Z",
  "updated_at": null,
  "is_superuser": false,
  "email_verified": false
}

console.log('Dashboard Stats Conversion:')
console.log(JSON.stringify(convertKeysSnakeToCamel(dashboardStats), null, 2))

console.log('\nUser Conversion:')
console.log(JSON.stringify(convertKeysSnakeToCamel(user), null, 2))