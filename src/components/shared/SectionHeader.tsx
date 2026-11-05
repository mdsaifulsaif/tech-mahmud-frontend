import { HiChevronRight } from "react-icons/hi2";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = "",
}: SectionHeaderProps) {
  const showAction = Boolean(actionLabel && onAction);

  return (
    <div className={`flex items-center justify-between gap-4 mb-4 sm:mb-5 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-[var(--color-primary)] shrink-0">
              {icon}
            </span>
          )}
          <h2 className="font-bold text-lg sm:text-xl text-[var(--color-text-primary)] tracking-tight">
            {title}
          </h2>
        </div>
        {description && (
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-1">
            {description}
          </p>
        )}
      </div>

      {showAction && (
        <button
          type="button"
          onClick={onAction}
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--color-primary)] hover:opacity-80 transition-all shrink-0 cursor-pointer"
        >
          <span>{actionLabel}</span>
          <HiChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}