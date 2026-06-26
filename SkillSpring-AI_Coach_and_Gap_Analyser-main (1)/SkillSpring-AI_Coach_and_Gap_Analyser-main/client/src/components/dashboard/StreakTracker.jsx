import { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function StreakTracker({ data }) {
  // Try to default to the month of the most recent activity data point, or current month
  const initialDate = useMemo(() => {
    if (data && data.length > 0) {
      const lastEntry = data[data.length - 1];
      return new Date(lastEntry.date);
    }
    return new Date();
  }, [data]);

  const [currentDate, setCurrentDate] = useState(initialDate);

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, firstDayIndex, monthName, year } = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonthVal = new Date(currentYear, currentMonth + 1, 0).getDate();
    // 0 index means Sunday
    const firstDayIndexVal = new Date(currentYear, currentMonth, 1).getDay();
    const monthNameVal = currentDate.toLocaleString('default', { month: 'long' });
    return { 
      daysInMonth: daysInMonthVal, 
      firstDayIndex: firstDayIndexVal, 
      monthName: monthNameVal, 
      year: currentYear 
    };
  }, [currentDate]);

  // Fast lookup dictionary for faster grid rendering
  const activityMap = useMemo(() => {
    const map = {};
    if (data) {
      data.forEach((item) => {
        // Assume format is YYYY-MM-DD
        map[item.date] = item;
      });
    }
    return map;
  }, [data]);

  // Construct Calendar Grid
  const daysRender = [];
  
  // Empty blocks for offset
  for (let i = 0; i < firstDayIndex; i++) {
    daysRender.push(
      <div 
        key={`empty-${i}`} 
        className="h-[46px] w-[46px] sm:h-14 sm:w-14 rounded-[12px] bg-transparent" 
      />
    );
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const isoDateString = `${year}-${monthStr}-${dayStr}`;
    
    const activity = activityMap[isoDateString];
    
    // Default styles for no activity
    let bgColor = 'bg-white/5'; 
    let borderStyle = 'border-white/10';
    let textColor = 'text-slate-400';
    
    // Style scales
    if (activity && activity.level > 0) {
      textColor = 'text-white font-bold text-shadow-sm';
      if (activity.level === 1) {
        bgColor = 'bg-brand-teal/30';
        borderStyle = 'border-brand-teal/40';
      } else if (activity.level === 2) {
        bgColor = 'bg-brand-teal/60';
        borderStyle = 'border-brand-teal/70';
      } else if (activity.level === 3) {
        bgColor = 'bg-brand-teal/90 shadow-[0_0_12px_rgba(45,212,191,0.2)]';
        borderStyle = 'border-brand-teal';
      } else {
        bgColor = 'bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.3)]'; 
        borderStyle = 'border-cyan-300';
      }
    }

    daysRender.push(
      <div
        key={`day-${isoDateString}`}
        className={`flex h-[46px] w-[46px] sm:h-14 sm:w-14 items-center justify-center rounded-[12px] border text-sm transition-all hover:scale-105 hover:border-white/40 ${bgColor} ${borderStyle} ${textColor}`}
        title={activity ? `${activity.count} activity level instances` : 'No activity'}
      >
        <span>{d}</span>
      </div>
    );
  }

  return (
    <Card className="flex flex-col p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Study Streak</p>
          <h3 className="mt-3 font-display text-3xl text-brand-text">Daily consistency heatmap</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300 max-w-md">
            Track momentum over the month. Every recorded activity lights up your calendar grid.
          </p>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-sm shrink-0">
          <button 
            type="button" 
            onClick={handlePrevMonth} 
            className="flex items-center justify-center rounded-xl p-2 text-brand-muted transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="w-[120px] text-center text-xs font-semibold uppercase tracking-widest text-white">
            {monthName} {year}
          </span>
          <button 
            type="button" 
            onClick={handleNextMonth} 
            className="flex items-center justify-center rounded-xl p-2 text-brand-muted transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto scrollbar-thin pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${monthName}-${year}`}
            initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-w-max"
          >
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
              {WEEKDAYS.map((day) => (
                <div key={day} className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">
                  {day}
                </div>
              ))}
              {daysRender}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
