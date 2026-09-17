import { useState } from 'react';

interface Props {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  disabledDates?: string[];
  onClose: () => void;
}

function toYMD(d: Date): string {
  return d.toISOString().split('T')[0];
}

export default function MiniCalendar({ value, onChange, minDate, disabledDates = [], onClose }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ? new Date(minDate + 'T00:00:00') : today;

  const initDate = value ? new Date(value + 'T00:00:00') : (min > today ? min : today);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#E4EAF2] p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <span className="text-sm font-semibold text-[#111827]">{monthName}</span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs text-[#667085] font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateObj = new Date(viewYear, viewMonth, day);
          const ymd = toYMD(dateObj);
          const isPast = dateObj < min;
          const isDisabled = disabledDates.includes(ymd) || isPast;
          const isSelected = ymd === value;
          const isToday = ymd === toYMD(today);

          return (
            <button
              key={day}
              onClick={() => { if (!isDisabled) { onChange(ymd); onClose(); } }}
              disabled={isDisabled}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors
                ${isSelected ? 'bg-[#174FC7] text-white font-semibold' : ''}
                ${!isSelected && !isDisabled ? 'hover:bg-[#EEF4FF] hover:text-[#174FC7]' : ''}
                ${isDisabled ? 'text-[#D1D5DB] cursor-not-allowed line-through' : 'text-[#111827]'}
                ${isToday && !isSelected ? 'ring-1 ring-[#174FC7] text-[#174FC7]' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
