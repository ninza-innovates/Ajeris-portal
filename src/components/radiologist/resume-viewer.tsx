'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ResumeViewerProps {
  resumeUrl?: string
  radiologistName: string
}

export function ResumeViewer({ resumeUrl, radiologistName }: ResumeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!resumeUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No resume uploaded</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Extract file name from URL
  const fileName = resumeUrl.split('/').pop() || 'resume.pdf'
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'pdf'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {fileExtension.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-sm">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                Resume for {radiologistName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(resumeUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const link = document.createElement('a')
                link.href = resumeUrl
                link.download = fileName
                link.click()
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="border rounded-lg overflow-hidden">
            {fileExtension === 'pdf' ? (
              <iframe
                src={resumeUrl}
                className="w-full h-[600px]"
                title={`Resume for ${radiologistName}`}
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>Preview not available for {fileExtension.toUpperCase()} files.</p>
                <p className="text-sm mt-2">Please download or open the file to view.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}