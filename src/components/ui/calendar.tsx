'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface CalendarProps {
  mode?: 'single'
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
}

// Simple calendar component for demonstration
function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onSelect?.(newDate)
  }
  
  const renderCalendarDays = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const startDay = firstDayOfMonth(currentMonth)
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />)
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = selected && 
        selected.getDate() === day && 
        selected.getMonth() === currentMonth.getMonth() &&
        selected.getFullYear() === currentMonth.getFullYear()
        
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            'h-9 w-9 text-center text-sm rounded-md hover:bg-accent hover:text-accent-foreground',
            isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            isToday && !isSelected && 'bg-accent text-accent-foreground'
          )}
        >
          {day}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className={cn('p-3', className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={previousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="h-9 w-9 text-center text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }