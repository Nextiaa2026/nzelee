"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Sélectionner date et heure",
  disabled = false,
  className,
}: DateTimePickerProps) {
  const date = React.useMemo(() => {
    if (!value) return undefined;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const [timeValue, setTimeValue] = React.useState(
    date ? format(date, "HH:mm") : "00:00"
  );

  React.useEffect(() => {
    if (date) {
      setTimeValue(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange?.(undefined);
      return;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    onChange?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      onChange?.(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10 rounded-lg border-foreground/10 bg-background transition-all hover:bg-foreground/[0.02]",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {date ? format(date, "PPP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white shadow-2xl rounded-2xl border-black/5" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="p-3"
        />
        <div className="border-t border-border/40 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-50" />
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="h-9 w-[120px] rounded-md border-foreground/10 bg-foreground/[0.02] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-mint/50"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
