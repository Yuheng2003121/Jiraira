"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";



interface DatePickerProps {
  onDateSelect: (date: Date) => void;
  defaultDate?: Date;
}

export function DatePicker({ onDateSelect, defaultDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    defaultDate || undefined
  );

  return (
    <div className=" flex flex-col gap-3 h-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-fit font-normal h-full"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className={cn(date ? "text-foreground" : "text-muted-foreground")}>
              {date ? date.toLocaleDateString() : "Select date"}
            </span>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            buttonVariant="ghost"
            onSelect={(date) => {
              onDateSelect(date!);
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
