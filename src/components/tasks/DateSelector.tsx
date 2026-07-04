'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedDate } from '@/features/tasks/taskSlice';
import { useGetAllTasksQuery } from '@/features/tasks/taskApi';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export const DateSelector = () => {
  const dispatch = useDispatch();
  const selectedDateStr = useSelector((state: RootState) => state.tasks.selectedDate);
  const { data: allTasks = [] } = useGetAllTasksQuery();

  const datesWithTasks = new Set(allTasks.map(task => task.selected_date));

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(popoverRef, () => setIsOpen(false));

  const selectedDate = new Date(selectedDateStr);
  
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  useEffect(() => {
    setCurrentMonth(selectedDate.getMonth());
    setCurrentYear(selectedDate.getFullYear());
  }, [selectedDateStr]);

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    dispatch(setSelectedDate(date.toISOString().split('T')[0]));
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    dispatch(setSelectedDate(date.toISOString().split('T')[0]));
  };

  const handleToday = () => {
    dispatch(setSelectedDate(new Date().toISOString().split('T')[0]));
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0); 
    dispatch(setSelectedDate(date.toISOString().split('T')[0]));
    setIsOpen(false);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 w-fit">
        <Button variant="ghost" size="sm" onClick={handlePrevDay} className="px-2 hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm font-bold tracking-tight">{formatDateForDisplay(selectedDate)}</span>
        </button>

        <Button variant="ghost" size="sm" onClick={handleNextDay} className="px-2 hover:bg-gray-100 text-gray-500">
          <ChevronRight className="w-5 h-5" />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={handleToday} className="text-sm font-semibold px-4 text-gray-600 hover:text-gray-900">
          Today
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-5">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <span className="font-bold text-gray-800 text-base">{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = new Date(currentYear, currentMonth, day, 12, 0, 0).toISOString().split('T')[0];
              const isSelected = selectedDateStr === dateStr;
              const hasTask = datesWithTasks.has(dateStr);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "relative h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm transition-colors",
                    isSelected 
                      ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-200" 
                      : "text-gray-700 hover:bg-blue-50 font-medium",
                    isToday && !isSelected && "text-blue-600 font-bold bg-blue-50/50"
                  )}
                >
                  {day}
                  {hasTask && (
                    <div className={cn(
                      "absolute bottom-1.5 w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-blue-500"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
