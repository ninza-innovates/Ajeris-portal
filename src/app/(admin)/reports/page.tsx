'use client'

import { useState } from 'react'
import { useReportTypes, useGenerateReport, useGeneratedReports, useScheduledReports } from '@/lib/api/hooks/use-reports'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  BarChart3,
  Download,
  FileText,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  Loader2,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [reportParams, setReportParams] = useState<Record<string, any>>({})
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf')
  
  const { data: reportTypes, isLoading: typesLoading } = useReportTypes()
  const { data: generatedReports, isLoading: generatedLoading } = useGeneratedReports()
  const { data: scheduledReports, isLoading: scheduledLoading } = useScheduledReports()
  const generateReport = useGenerateReport()
  
  const getReportIcon = (category: string) => {
    switch (category) {
      case 'operational': return BarChart3
      case 'clinical': return TrendingUp
      case 'compliance': return Shield
      case 'financial': return FileText
      default: return FileText
    }
  }
  
  const getReportColor = (category: string) => {
    switch (category) {
      case 'operational': return { color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 'clinical': return { color: 'text-green-600', bgColor: 'bg-green-100' }
      case 'compliance': return { color: 'text-purple-600', bgColor: 'bg-purple-100' }
      case 'financial': return { color: 'text-orange-600', bgColor: 'bg-orange-100' }
      default: return { color: 'text-gray-600', bgColor: 'bg-gray-100' }
    }
  }
  
  const handleGenerateReport = () => {
    if (!selectedReportType) return
    
    generateReport.mutate({
      reportTypeId: selectedReportType,
      parameters: reportParams,
      format: selectedFormat,
    })
    
    setSelectedReportType(null)
    setReportParams({})
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage operational reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Report Types</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          {/* Report Types */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {typesLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32" />
                  </CardContent>
                </Card>
              ))
            ) : (
              reportTypes?.map((report) => {
                const Icon = getReportIcon(report.category)
                const colors = getReportColor(report.category)
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`${colors.bgColor} p-3 rounded-lg`}>
                          <Icon className={`h-6 w-6 ${colors.color}`} />
                        </div>
                        <Badge variant="secondary">{report.category}</Badge>
                      </div>
                      <CardTitle className="mt-4">{report.name}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Formats</span>
                          <div className="flex gap-1">
                            {report.formats.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Est. time</span>
                          <span>{report.estimatedRunTime}s</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedReportType(report.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
              <CardDescription>Download or view previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : generatedReports?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No reports generated yet</p>
              ) : (
                <div className="space-y-4">
                  {generatedReports?.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{report.reportTypeName}</p>
                          <p className="text-sm text-muted-foreground">
                            Generated {new Date(report.generatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={
                            report.status === 'completed' ? 'success' : 
                            report.status === 'processing' ? 'warning' : 
                            report.status === 'failed' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {report.status === 'processing' && (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          )}
                          {report.status === 'completed' && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {report.status === 'failed' && (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                        {report.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage recurring report generation</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : scheduledReports?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No scheduled reports configured</p>
              ) : (
                <div className="space-y-4">
                  {scheduledReports?.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{schedule.name}</h4>
                          <p className="text-sm text-muted-foreground">{schedule.reportTypeName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {schedule.schedule.frequency} at {schedule.schedule.time}
                            </span>
                            <span className="text-muted-foreground">
                              Next run: {new Date(schedule.nextRunAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={schedule.enabled ? 'success' : 'secondary'}>
                            {schedule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={!!selectedReportType} onOpenChange={() => setSelectedReportType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Configure parameters and generate the report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReportType && reportTypes && (
            <div className="space-y-4">
              <div>
                <Label>Report Format</Label>
                <Select value={selectedFormat} onValueChange={(value: any) => setSelectedFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes
                      .find((r) => r.id === selectedReportType)
                      ?.formats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {reportTypes
                .find((r) => r.id === selectedReportType)
                ?.parameters.map((param) => (
                  <div key={param.name}>
                    <Label>{param.label}</Label>
                    {param.type === 'date' && (
                      <Input
                        type="month"
                        value={reportParams[param.name] || param.defaultValue || ''}
                        onChange={(e) => setReportParams({ ...reportParams, [param.name]: e.target.value })}
                        required={param.required}
                      />
                    )}
                    {param.type === 'select' && (
                      <Select
                        value={reportParams[param.name] || ''}
                        onValueChange={(value) => setReportParams({ ...reportParams, [param.name]: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${param.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {param.type === 'number' && (
                      <Input
                        type="number"
                        value={reportParams[param.name] || param.defaultValue || ''}
                        onChange={(e) => setReportParams({ ...reportParams, [param.name]: e.target.value })}
                        required={param.required}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReportType(null)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={generateReport.isPending}>
              {generateReport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}