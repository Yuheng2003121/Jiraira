import React from "react";
import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDateProps {
  date: string;
  className?: string;
}
export default function TaskDate({ date, className }: TaskDateProps) {
  const today = new Date();
  const endDate = new Date(date);
  const daysDifference = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  if (daysDifference <= 3) {
    textColor = "text-red-500";
  } else if (daysDifference <= 7) {
    textColor = "text-orange-500";
  } else if (daysDifference <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={cn("truncate", textColor, className)}>
      {format(date, "PPP")}
    </div>
  );
}
