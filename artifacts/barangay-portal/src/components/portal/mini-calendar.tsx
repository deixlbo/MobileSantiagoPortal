import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  markedDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  getDateCount?: (date: string) => number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function MiniCalendar({ markedDates, selectedDate, onSelectDate, getDateCount }: MiniCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const pad = (n: number) => String(n).padStart(2, "0");
  const toDateStr = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

  const markedSet = new Set(markedDates);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="bg-white border border-border rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm text-foreground">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toDateStr(day);
          const isMarked = markedSet.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const count = getDateCount ? getDateCount(dateStr) : 0;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && isToday && "border border-primary text-primary",
                !isSelected && !isToday && isMarked && "bg-primary/10 text-primary hover:bg-primary/20",
                !isSelected && !isToday && !isMarked && "text-foreground/70 hover:bg-muted"
              )}
            >
              {day}
              {isMarked && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              {isMarked && isSelected && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white text-primary text-[8px] font-bold flex items-center justify-center border border-primary/30">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center py-1 rounded-md hover:bg-muted transition"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
