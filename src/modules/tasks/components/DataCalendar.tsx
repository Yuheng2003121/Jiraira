import React, { useState } from "react";
import { Task } from "../types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import {
  parse,
  format,
  startOfWeek,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import "./data-calendar.css"

interface DataCalendarProps {
  data: Task[];
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = ({
  date,
  onNavigate,
}: {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}) => {
  return (
    <div className="flex mb-4 gap-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        onClick={() => onNavigate("PREV")}
        variant={"secondary"}
        size={"icon"}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex-1 flex items-center justify-center border border-input rounded-md px-3 py-2">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        onClick={() => onNavigate("NEXT")}
        variant={"secondary"}
        size={"icon"}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
export default function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project!}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
}
