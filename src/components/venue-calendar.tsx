"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { useApp, venueName, getScopedProgrammes } from "@/lib/mock";
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

export function VenueCalendar({ className }: { className?: string }) {
  const programmes = useApp((s) => s.programmes);
  const user = useApp((s) => s.user);
  const users = useApp((s) => s.users);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const wingColors = useMemo(() => {
    const map: Record<string, string> = {};
    users
      .filter((u) => u.role === "wing" && u.wing)
      .forEach((u) => {
        map[u.wing!] = u.color || "bg-primary/15 text-primary border-primary/30";
      });
    return map;
  }, [users]);

  const scoped = useMemo(() => {
    return getScopedProgrammes(programmes, user, users);
  }, [user, programmes, users]);

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
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[140px] text-center text-sm font-medium">
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
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-b bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-3 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {grid.map((day, i) => {
              const dayProgrammes = scoped.filter(
                (p) =>
                  isSameDay(new Date(p.date), day) &&
                  p.status !== "draft" &&
                  p.status !== "rejected",
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
                    {dayProgrammes.slice(0, 3).map((p) => {
                      const color = wingColors[p.wing] ?? "bg-muted text-foreground border-border";
                      const isHex = color.startsWith("#");
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelected(p.id)}
                          className={cn(
                            "block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium cursor-pointer",
                            !isHex && color,
                          )}
                          style={
                            isHex
                              ? {
                                  backgroundColor: `${color}26`,
                                  color: color,
                                  borderColor: `${color}4D`,
                                }
                              : undefined
                          }
                        >
                          {p.startTime} {p.name}
                        </button>
                      );
                    })}
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
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Legend:</span>
        {Object.entries(wingColors).map(([cat, cls]) => {
          const isHex = cls.startsWith("#");
          return (
            <span
              key={cat}
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5",
                !isHex && cls,
              )}
              style={
                isHex
                  ? {
                      backgroundColor: `${cls}26`,
                      color: cls,
                      borderColor: `${cls}4D`,
                    }
                  : undefined
              }
            >
              {cat}
            </span>
          );
        })}
      </div>

      <Sheet open={!!programme} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md border-l-4 border-black bg-white shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] p-0 flex flex-col overflow-y-auto">
          {programme && (
            <>
              <SheetHeader className="p-6 border-b-4 border-black bg-[#c8ff2e] relative">
                <SheetTitle className="text-3xl font-black uppercase leading-tight pr-8">{programme.name}</SheetTitle>
                <SheetDescription className="font-bold text-black uppercase tracking-widest text-xs mt-2">
                  {programme.wing} · {programme.category.join(", ")}
                </SheetDescription>
              </SheetHeader>
              <div className="p-6 flex-1 space-y-6">
                <div className="grid gap-4 border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Row label="Date">{format(new Date(programme.date), "PPP")}</Row>
                  <Row label="Time">
                    {programme.startTime}–{programme.endTime}
                  </Row>
                  <Row label="Venue">{venueName(programme.venueId)}</Row>
                  <Row label="Audience">{programme.audience}</Row>
                  {programme.guests && programme.guests.length > 0 && (
                    <Row label="Guests">
                      {programme.guests.map((g, i) => (
                        <div key={i}>
                          {g.name} <span className="text-muted-foreground text-xs font-normal">({g.position})</span>
                        </div>
                      ))}
                    </Row>
                  )}
                  <Row label="Status">
                    <StatusBadge status={programme.status} />
                  </Row>
                </div>
                <div className="border-4 border-black p-4 bg-[#ffcc00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="font-black uppercase mb-2">Purpose</h4>
                  <p className="font-bold text-sm">{programme.purpose}</p>
                </div>
                <Button asChild className="w-full border-4 border-black bg-black text-white hover:bg-black/80 hover:text-white font-black uppercase tracking-widest transition-transform active:translate-x-[2px] active:translate-y-[2px] rounded-none py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Link href={user ? `/programmes/${programme.id}` : `/events/${programme.id}`}>Open programme →</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-start gap-2 border-b-2 border-black/10 pb-3 last:border-0 last:pb-0">
      <div className="text-xs font-black uppercase tracking-widest text-black">{label}</div>
      <div className="text-sm font-bold">{children}</div>
    </div>
  );
}
