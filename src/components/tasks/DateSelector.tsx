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
      <div className="flex items-center gap-1 bg-[#272B33] p-1.5 rounded shadow-sm border border-[#3A414B] w-fit">
        <button onClick={handlePrevDay} className="p-1 px-2 hover:bg-[#323842] rounded text-[#8B929D] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-1.5 rounded hover:bg-[#323842] text-[#0D73ED] transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm font-bold tracking-tight">{formatDateForDisplay(selectedDate)}</span>
        </button>

        <button onClick={handleNextDay} className="p-1 px-2 hover:bg-[#323842] rounded text-[#8B929D] transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-[#3A414B] mx-1"></div>
        
        <button onClick={handleToday} className="text-sm font-semibold px-4 text-[#8B929D] hover:text-white transition-colors">
          Today
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-[#272B33] rounded shadow-xl border border-[#3A414B] p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-5">
            <button onClick={prevMonth} className="p-1.5 hover:bg-[#323842] rounded transition-colors"><ChevronLeft className="w-5 h-5 text-[#8B929D]" /></button>
            <span className="font-bold text-white text-base">{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-[#323842] rounded transition-colors"><ChevronRight className="w-5 h-5 text-[#8B929D]" /></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-[#8B929D]">{day}</div>
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
                    "relative h-9 w-9 mx-auto rounded flex items-center justify-center text-sm transition-colors",
                    isSelected 
                      ? "bg-[#0D73ED] text-white font-bold" 
                      : "text-[#E0E0E0] hover:bg-[#323842] font-medium",
                    isToday && !isSelected && "text-[#0D73ED] font-bold bg-[#0D73ED]/10"
                  )}
                >
                  {day}
                  {hasTask && (
                    <div className={cn(
                      "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-[#00BFA5]"
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
