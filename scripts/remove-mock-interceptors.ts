#!/usr/bin/env npx tsx

import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/lib/api/client.ts')

// Read the file
const content = fs.readFileSync(filePath, 'utf-8')

// Find the start and end of the mock interceptors section
const mockStart = content.indexOf('// ========== TEMPORARY MOCK INTERCEPTORS ==========')
const mockEndPattern = '} else {'
const possibleEnds = []

// Find all possible end positions
let searchPos = mockStart
while (searchPos < content.length) {
  const pos = content.indexOf(mockEndPattern, searchPos)
  if (pos === -1) break
  
  // Check if this is followed by the response wrapping code
  const nextContent = content.substring(pos, pos + 200)
  if (nextContent.includes('// Handle paginated responses from backend')) {
    possibleEnds.push(pos)
    break
  }
  searchPos = pos + 1
}

if (mockStart === -1 || possibleEnds.length === 0) {
  console.error('Could not find mock interceptors section boundaries')
  process.exit(1)
}

const mockEnd = possibleEnds[0]

// Extract the mock section
const mockSection = content.substring(mockStart, mockEnd)
console.log('Found mock interceptors section:')
console.log(`Start: ${mockStart}, End: ${mockEnd}`)
console.log(`Length: ${mockSection.length} characters`)

// Count how many mocks are in there
const mockCount = (mockSection.match(/console\.log\('=== MOCK:/g) || []).length
console.log(`Found ${mockCount} mock interceptors`)

// Replace the entire mock section with a comment
const newContent = 
  content.substring(0, mockStart) +
  '// ========== MOCK INTERCEPTORS REMOVED ==========\n      // All mock interceptors have been removed as real endpoints are now available\n      // If you need to add temporary mocks, please document why they are needed\n      ' +
  content.substring(mockEnd)

// Write the updated content
fs.writeFileSync(filePath, newContent)
console.log('✅ Mock interceptors removed successfully!')