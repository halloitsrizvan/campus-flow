"use client";

import Link from "next/link";
import { AppShell, PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { useApp, venueName } from "@/lib/mock";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const CATEGORY_COLORS: Record<string, string> = {
  Technical: "bg-primary/15 text-primary border-primary/30",
  Cultural: "bg-warning/15 text-warning border-warning/30",
  Sports: "bg-success/15 text-success border-success/30",
  Academic: "bg-info/15 text-info border-info/30",
  Workshop: "bg-accent text-accent-foreground border-border",
  Seminar: "bg-info/15 text-info border-info/30",
  Competition: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function CalendarPage() {
  const programmes = useApp((s) => s.programmes);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const grid = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    const days: Date[] = [];
    let d = start;
    while (d <= end) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [cursor]);

  const programme = selected ? programmes.find((p) => p.id === selected) : null;

  return (
    <AppShell>
      <title>Venue Calendar — VenueHub</title>
      <meta name="description" content="Monthly calendar view of programmes and venue bookings." />
      <div className="space-y-6">
        <PageHeader
          title="Venue Calendar"
          description="Colour-coded bookings by category. Click an event for details."
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-32 text-center text-sm font-medium">
                {format(cursor, "MMMM yyyy")}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
                Today
              </Button>
            </div>
          }
        />

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-3 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {grid.map((day, i) => {
              const dayProgrammes = programmes.filter(
                (p) => isSameDay(new Date(p.date), day) && p.status !== "rejected",
              );
              const inMonth = isSameMonth(day, cursor);
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-28 border-b border-r p-2 text-left align-top",
                    !inMonth && "bg-muted/20 text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      today && "bg-primary text-primary-foreground font-semibold",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayProgrammes.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className={cn(
                          "block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium cursor-pointer",
                          CATEGORY_COLORS[p.category] ?? "bg-muted text-foreground border-border",
                        )}
                      >
                        {p.startTime} {p.name}
                      </button>
                    ))}
                    {dayProgrammes.length > 3 && (
                      <div className="text-[11px] text-muted-foreground">
                        +{dayProgrammes.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Legend:</span>
          {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
            <span
              key={cat}
              className={cn("inline-flex items-center rounded-full border px-2 py-0.5", cls)}
            >
              {cat}
            </span>
          ))}
        </div>

        <Sheet open={!!programme} onOpenChange={(v) => !v && setSelected(null)}>
          <SheetContent className="w-full sm:max-w-md">
            {programme && (
              <>
                <SheetHeader>
                  <SheetTitle>{programme.name}</SheetTitle>
                  <SheetDescription>
                    {programme.wing} · {programme.category}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4 text-sm">
                  <Row label="Date">{format(new Date(programme.date), "PPP")}</Row>
                  <Row label="Time">
                    {programme.startTime}–{programme.endTime}
                  </Row>
                  <Row label="Venue">{venueName(programme.venueId)}</Row>
                  <Row label="Expected">{programme.expectedStudents} students</Row>
                  <Row label="Budget">₹{programme.budget.toLocaleString()}</Row>
                  <Row label="Status">
                    <StatusBadge status={programme.status} />
                  </Row>
                  <p className="text-muted-foreground">{programme.purpose}</p>
                  <Button asChild className="w-full">
                    <Link href={`/programmes/${programme.id}`}>Open programme →</Link>
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-start gap-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
