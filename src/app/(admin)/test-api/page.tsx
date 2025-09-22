'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { runAllTests, testApiConnection, testReadyEndpoints } from '@/lib/api/test-connection'

export default function TestApiPage() {
  const [email, setEmail] = useState('admin@ajeris.com')
  const [password, setPassword] = useState('')
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Override console.log to capture logs
  const captureLog = (message: string, ...args: any[]) => {
    const logMessage = `${message} ${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ')}`
    setLogs(prev => [...prev, logMessage])
    console.log(message, ...args)
  }

  const runTests = async () => {
    setTesting(true)
    setLogs([])
    setResults(null)

    // Temporarily override console.log
    const originalLog = console.log
    console.log = captureLog

    try {
      // Update test credentials
      const { setTestCredentials, runAllTests } = await import('@/lib/api/test-connection')
      setTestCredentials(email, password)

      await runAllTests()
      
      setResults({
        success: true,
        message: 'Tests completed successfully'
      })
    } catch (error: any) {
      setResults({
        success: false,
        message: error.message
      })
    } finally {
      console.log = originalLog
      setTesting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            Test the connection to the Ajeris API staging server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Test Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ajeris.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Test Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter test password"
              />
            </div>
          </div>

          <Button 
            onClick={runTests} 
            disabled={testing || !password}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run API Tests'
            )}
          </Button>

          {logs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Test Logs</h3>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {logs.map((log, index) => {
                    let icon = ''
                    let className = ''
                    
                    if (log.includes('✅')) {
                      className = 'text-green-400'
                    } else if (log.includes('❌')) {
                      className = 'text-red-400'
                    } else if (log.includes('⚠️')) {
                      className = 'text-yellow-400'
                    } else if (log.includes('🔍') || log.includes('📡') || log.includes('🔐') || log.includes('🧪')) {
                      className = 'text-blue-400'
                    } else if (log.includes('📊') || log.includes('✨')) {
                      className = 'text-purple-400'
                    }
                    
                    return (
                      <div key={index} className={className}>
                        {log}
                      </div>
                    )
                  })}
                </pre>
              </div>
            </div>
          )}

          {results && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              results.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {results.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{results.message}</span>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold">Important Notes:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>This page tests the API endpoints Tim marked as ready</li>
                  <li>Make sure you have valid test credentials</li>
                  <li>The API base URL is: https://api.staging.ajeris.com</li>
                  <li>All admin endpoints use the /api/admin/ prefix</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}