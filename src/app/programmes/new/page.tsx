"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp, CATEGORIES, venueName, type Programme } from "@/lib/mock";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Paperclip,
  Upload,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Schedule" },
  { id: 3, label: "Venue" },
  { id: 4, label: "Details" },
  { id: 5, label: "Attachments" },
  { id: 6, label: "Review" },
];

export default function NewProgrammePage() {
  return (
    <AppShell>
      <title>Register Programme — VenueHub</title>
      <meta name="description" content="Submit a new programme for approval." />
      <RegisterWizard />
    </AppShell>
  );
}

function RegisterWizard() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const venues = useApp((s) => s.venues);
  const programmes = useApp((s) => s.programmes);
  const addProgramme = useApp((s) => s.addProgramme);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    category: "",
    purpose: "",
    date: "",
    startTime: "10:00",
    endTime: "13:00",
    venueId: "",
    expectedStudents: 100,
    guest: "",
    equipment: "",
    budget: 10000,
    files: [] as { name: string; size: string }[],
  });
  const conflict = useMemo(() => {
    if (!form.venueId || !form.date) return null;
    return programmes.find(
      (p) =>
        p.venueId === form.venueId &&
        p.date === form.date &&
        p.status !== "rejected" &&
        !(p.endTime <= form.startTime || p.startTime >= form.endTime),
    );
  }, [form.venueId, form.date, form.startTime, form.endTime, programmes]);

  if (!user) return null;

  const canNext = () => {
    if (step === 1) return form.name && form.category && form.purpose;
    if (step === 2)
      return form.date && form.startTime && form.endTime && form.startTime < form.endTime;
    if (step === 3) return form.venueId && !conflict;
    if (step === 4) return form.expectedStudents > 0 && form.budget >= 0;
    return true;
  };

  function submit() {
    const now = new Date().toISOString();
    const p: Programme = {
      id: `p${Date.now()}`,
      name: form.name,
      category: form.category,
      purpose: form.purpose,
      wing: user!.wing ?? "Unknown Wing",
      wingId: "w1",
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      venueId: form.venueId,
      expectedStudents: Number(form.expectedStudents),
      guest: form.guest,
      equipment: form.equipment,
      budget: Number(form.budget),
      status: "submitted",
      createdAt: now,
      attachments: form.files,
      comments: [],
      timeline: [
        { label: "Submitted by Wing", at: now, done: true },
        { label: "Union Approval", done: false },
        { label: "Teacher Approval", done: false },
        { label: "Booked", done: false },
      ],
    };
    addProgramme(p);
    toast.success("Programme submitted for approval");
    router.push(`/programmes/${p.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Register Programme"
        description="Submit a new programme in 6 quick steps."
      />

      {/* Stepper */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <ol className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <li key={s.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold",
                    done && "border-success bg-success text-success-foreground",
                    active && "border-primary bg-primary text-primary-foreground",
                    !done && !active && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                </div>
                <span className={cn("text-sm", active ? "font-medium" : "text-muted-foreground")}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {step === 1 && (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Programme Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. TechFest 2025"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Purpose</Label>
              <Textarea
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="Describe the programme…"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5 sm:col-span-3">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>End Time</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Venue</Label>
              <Select value={form.venueId} onValueChange={(v) => setForm({ ...form, venueId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues
                    .filter((v) => v.active && !v.blocked)
                    .map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} <span className="text-muted-foreground">— cap {v.capacity}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <CalendarDays className="h-4 w-4 text-primary" /> Calendar preview
              </div>
              {form.venueId && form.date ? (
                <div className="space-y-1 text-muted-foreground">
                  <div>
                    Selected:{" "}
                    <span className="text-foreground font-medium">{venueName(form.venueId)}</span>{" "}
                    on {format(new Date(form.date), "PPP")}
                  </div>
                  <div>
                    Time: {form.startTime} – {form.endTime}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Select a venue and date to see conflicts.
                </div>
              )}
            </div>

            {conflict && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium">Venue conflict detected</div>
                  <div>
                    "{conflict.name}" is already booked at {conflict.startTime}–{conflict.endTime}.
                    Pick another time or venue.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Expected Students</Label>
              <Input
                type="number"
                min={1}
                value={form.expectedStudents}
                onChange={(e) => setForm({ ...form, expectedStudents: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Budget (₹)</Label>
              <Input
                type="number"
                min={0}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label>Chief Guest (optional)</Label>
              <Input
                value={form.guest}
                onChange={(e) => setForm({ ...form, guest: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label>Equipment Required</Label>
              <Textarea
                value={form.equipment}
                onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                rows={3}
                placeholder="Projector, mic, stage lighting…"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center hover:bg-muted/40">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="mt-2 text-sm font-medium">Click to upload</div>
              <div className="text-xs text-muted-foreground">
                Poster, permission letter, PDFs (mock)
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []).map((f) => ({
                    name: f.name,
                    size: `${(f.size / 1024).toFixed(0)} KB`,
                  }));
                  setForm({ ...form, files: [...form.files, ...files] });
                }}
              />
            </label>
            {form.files.length > 0 && (
              <ul className="divide-y rounded-lg border">
                {form.files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{f.size}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, files: form.files.filter((_, x) => x !== i) })
                      }
                      className="text-xs font-medium text-destructive hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info/5 p-3 text-sm text-info">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                Review the details below. Once submitted the programme goes to Union for approval.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ReviewRow
                icon={<Info className="h-4 w-4" />}
                label="Programme"
                value={`${form.name} · ${form.category}`}
              />
              <ReviewRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Schedule"
                value={`${form.date} · ${form.startTime}–${form.endTime}`}
              />
              <ReviewRow
                icon={<MapPin className="h-4 w-4" />}
                label="Venue"
                value={venueName(form.venueId)}
              />
              <ReviewRow
                icon={<Users className="h-4 w-4" />}
                label="Students"
                value={String(form.expectedStudents)}
              />
              <ReviewRow
                icon={<Wallet className="h-4 w-4" />}
                label="Budget"
                value={`₹${Number(form.budget).toLocaleString()}`}
              />
              <ReviewRow
                icon={<Paperclip className="h-4 w-4" />}
                label="Attachments"
                value={`${form.files.length} file(s)`}
              />
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="text-xs font-medium uppercase text-muted-foreground">Purpose</div>
              <div className="mt-1">{form.purpose || "—"}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {step < 6 ? (
          <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit}>Submit Programme</Button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value || "—"}</div>
      </div>
    </div>
  );
}
