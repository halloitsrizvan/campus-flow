"use client";

import Link from "next/link";
import { useApp, venueName } from "@/lib/mock";
import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IndexPage() {
  const programmes = useApp((s) => s.programmes);
  const user = useApp((s) => s.user);

  // Only show approved and completed programmes for public visibility
  const publicProgrammes = programmes
    .filter((p) => p.status === "teacher_approved" || p.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,oklch(0.9_0.06_277/_0.6),transparent_50%),radial-gradient(circle_at_85%_90%,oklch(0.92_0.07_165/_0.55),transparent_45%)]"
      />
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/40 px-6 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="VenueHub Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight">VenueHub</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button
              asChild
              variant="outline"
              className="bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent pb-2">
            College Events & Programmes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-lg sm:text-xl">
            Discover all the upcoming and completed events across our college venues.
          </p>
        </div>

        {publicProgrammes.length === 0 ? (
          <div className="text-center py-20 bg-card/30 backdrop-blur-sm rounded-3xl border border-white/10 shadow-sm">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No public programmes yet</h3>
            <p className="text-muted-foreground">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicProgrammes.map((p) => (
              <Link
                href={`/p/${p.id}`}
                key={p.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-card/60 hover:border-white/20"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight text-lg transition-colors group-hover:text-primary">
                      {p.name}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {p.wing}
                    </p>
                  </div>
                  <Badge
                    variant={p.status === "completed" ? "secondary" : "default"}
                    className="shrink-0 shadow-sm"
                  >
                    {p.status === "completed" ? "Completed" : "Upcoming"}
                  </Badge>
                </div>

                <p className="mb-6 text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
                  {p.purpose || "No description provided."}
                </p>

                <div className="mt-auto space-y-3 text-sm pt-4 border-t border-border/50">
                  <div className="flex items-center text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    <CalendarDays className="mr-3 h-4 w-4 shrink-0 text-primary/70" />
                    <span className="truncate font-medium">
                      {format(new Date(p.date), "MMM d, yyyy")} • {p.startTime} - {p.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    <MapPin className="mr-3 h-4 w-4 shrink-0 text-primary/70" />
                    <span className="truncate font-medium">{venueName(p.venueId)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
