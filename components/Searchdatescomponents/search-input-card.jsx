import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function SearchInputCard({
  icon,
  label,
  value,
  subtitle,
  badge,
  className,
  showChevron = true,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-4 border border-neutral-200/90 rounded-2xl bg-white",
        "shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md active:scale-[0.98] active:bg-neutral-50/80",
        "cursor-pointer transition-all duration-150 select-none",
        className
      )}
      {...props}
    >
      <div className="w-10 h-10 rounded-xl bg-neutral-100/80 text-neutral-700 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 leading-tight">
          {label}
        </div>
        <div className="text-sm font-bold text-neutral-900 truncate mt-0.5">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-neutral-500 font-medium truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      {badge && (
        <span className="px-2.5 py-1 text-xs font-bold bg-orange-50 text-[#ff6900] border border-orange-200/80 rounded-full shrink-0">
          {badge}
        </span>
      )}
      {showChevron && (
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
      )}
      {children}
    </div>
  );
}
