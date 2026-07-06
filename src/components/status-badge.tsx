import { statusMeta, type ProgrammeStatus } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: ProgrammeStatus;
  className?: string;
}) {
  const m = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        m.cls,
        className,
      )}
    >
      {m.label}
    </span>
  );
}
