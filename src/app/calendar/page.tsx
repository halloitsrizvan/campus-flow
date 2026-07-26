"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { VenueCalendar } from "@/components/venue-calendar";

export default function CalendarPage() {
  return (
    <AppShell>
      <title>Venue Calendar — DIIA Flow</title>
      <meta name="description" content="Monthly calendar view of programmes and venue bookings." />
      <div className="space-y-6">
        <PageHeader
          title="Venue Calendar"
          description="Colour-coded bookings by wing. Click an event for details."
        />
        <VenueCalendar />
      </div>
    </AppShell>
  );
}
