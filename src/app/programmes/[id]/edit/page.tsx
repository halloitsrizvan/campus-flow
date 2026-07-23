"use client";

import { use } from "react";
import { AppShell } from "@/components/app-shell";
import { ProgrammeWizard } from "@/components/programme-wizard";
import { useApp } from "@/lib/mock";
import { EmptyState } from "@/components/empty-state";
import { CalendarDays } from "lucide-react";

export default function EditProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const programmes = useApp((s) => s.programmes);
  const user = useApp((s) => s.user);
  const programme = programmes.find((p) => p.id === resolvedParams.id);

  if (!programme) {
    return (
      <AppShell>
        <EmptyState
          icon={<CalendarDays className="h-6 w-6 text-muted-foreground" />}
          title="Programme not found"
          description="The programme you're looking for doesn't exist."
        />
      </AppShell>
    );
  }

  // Check if editable
  const isEditable =
    user &&
    ["wing", "super_admin", "union", "teacher"].includes(user.role) &&
    (programme.status === "submitted" ||
      programme.status === "draft" ||
      (user.role === "union" &&
        (programme.status === "booked" || programme.status === "completed")));

  if (!isEditable) {
    return (
      <AppShell>
        <EmptyState
          icon={<CalendarDays className="h-6 w-6 text-muted-foreground" />}
          title="Cannot Edit Programme"
          description="You do not have permission to edit this programme, or it has already passed the initial submission stage."
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <title>Edit Programme — VenueHub</title>
      <meta name="description" content="Edit your submitted programme." />
      <ProgrammeWizard initialData={programme} />
    </AppShell>
  );
}
