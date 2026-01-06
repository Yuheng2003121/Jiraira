import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipDemoProps {
  children: React.ReactNode;
  message: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "muted"
    | "teritary"
    | null
    | undefined;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
export function CustomTooltip({
  children,
  message,
  variant,
  onClick,
  disabled = false,
  className,
}: TooltipDemoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} className={cn(className)} disabled={disabled} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
}
