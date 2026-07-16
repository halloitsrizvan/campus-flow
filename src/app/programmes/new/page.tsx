"use client";

import { AppShell } from "@/components/app-shell";
import { ProgrammeWizard } from "@/components/programme-wizard";

export default function NewProgrammePage() {
  return (
    <AppShell>
      <title>Register Programme — VenueHub</title>
      <meta name="description" content="Submit a new programme for approval." />
      <ProgrammeWizard />
    </AppShell>
  );
}
