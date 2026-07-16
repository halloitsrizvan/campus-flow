"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp, venueName } from "@/lib/mock";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Paperclip,
  MessageSquare,
  Check,
  X,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

export default function ProgrammeDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const router = useRouter();
  const user = useApp((s) => s.user);
  const programme = useApp((s) => s.programmes.find((p) => p.id === id));
  const updateProgramme = useApp((s) => s.updateProgramme);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  if (!user) return null;
  if (!programme) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-10 text-center">
          <h2 className="text-lg font-semibold">Programme not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">It may have been deleted.</p>
          <Button className="mt-4" onClick={() => router.push("/programmes")}>
            Back to programmes
          </Button>
        </div>
      </AppShell>
    );
  }

  function addComment() {
    if (!comment.trim()) return;
    const newComment = {
      id: `c${Date.now()}`,
      author: user!.name,
      role: user!.role,
      text: comment.trim(),
      at: new Date().toISOString(),
    };
    updateProgramme(programme!.id, { comments: [...programme!.comments, newComment] });
    setComment("");
    toast.success("Comment added");
  }

  function approve() {
    if (user!.role === "union") {
      updateProgramme(programme!.id, {
        status: "union_approved",
        timeline: programme!.timeline.map((t) =>
          t.label.toLowerCase().includes("union")
            ? { ...t, done: true, at: new Date().toISOString() }
            : t,
        ),
      });
      toast.success("Approved by Union");
    } else if (user!.role === "teacher") {
      updateProgramme(programme!.id, {
        status: "teacher_approved",
        timeline: programme!.timeline.map((t) => {
          if (t.label.toLowerCase().includes("teacher") || t.label.toLowerCase() === "booked")
            return { ...t, done: true, at: new Date().toISOString() };
          return t;
        }),
      });
      toast.success("Approved by Faculty — venue booked");
    }
  }

  function reject() {
    updateProgramme(programme!.id, { status: "rejected" });
    toast.error("Programme rejected");
  }

  const canApprove =
    (user.role === "union" && programme.status === "submitted") ||
    (user.role === "teacher" && programme.status === "union_approved");

  function submitRating() {
    if (!rating) return;
    updateProgramme(programme!.id, { rating, ratingRemarks: comment });
    setRating(0);
    setComment("");
    toast.success("Rating submitted");
  }

  return (
    <AppShell>
      <title>{`${programme.name} — VenueHub`}</title>
      <meta name="description" content="Programme details, approval timeline and comments." />
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={() => router.push("/programmes")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to programmes
        </button>

        <PageHeader
          title={programme.name}
          description={`${programme.wing} · ${programme.category}`}
          action={<StatusBadge status={programme.status} />}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold">Programme Information</h3>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {programme.purpose}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Date & Time"
                  value={`${format(new Date(programme.date), "PPP")} · ${programme.startTime}–${programme.endTime}`}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Venue"
                  value={venueName(programme.venueId)}
                />
                <InfoRow
                  icon={<Users className="h-4 w-4" />}
                  label="Audience"
                  value={programme.audience}
                />
                <div className="flex items-start gap-3 rounded-lg border bg-background p-3 sm:col-span-2">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Budget Breakdown
                    </div>
                    {programme.budget && programme.budget.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {programme.budget.map((b, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <span>{b.item}</span>
                            <span className="font-medium">₹{b.amount.toLocaleString()}</span>
                          </li>
                        ))}
                        <li className="flex justify-between text-sm font-semibold pt-2 border-t mt-2">
                          <span>Total</span>
                          <span>
                            ₹
                            {programme.budget
                              .reduce((acc, curr) => acc + curr.amount, 0)
                              .toLocaleString()}
                          </span>
                        </li>
                      </ul>
                    ) : (
                      <div className="text-sm font-medium mt-1">₹0</div>
                    )}
                  </div>
                </div>
                {programme.guests && programme.guests.length > 0 && (
                  <InfoRow
                    icon={<Users className="h-4 w-4" />}
                    label="Guests"
                    value={programme.guests.map((g) => `${g.name} (${g.position})`).join(", ")}
                  />
                )}
                {programme.equipment && programme.equipment.length > 0 && (
                  <InfoRow
                    icon={<Paperclip className="h-4 w-4" />}
                    label="Permissions / Equipment"
                    value={programme.equipment.join(", ")}
                  />
                )}
              </div>
            </div>

            {programme.poster && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Poster</h3>
                {programme.poster.url && (
                  <div className="mt-4 mb-4 relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg border">
                    <img
                      src={programme.poster.url}
                      alt={programme.poster.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <ul className="mt-3 divide-y rounded-lg border">
                  <li className="flex items-center gap-3 p-3 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">
                      {programme.poster.url ? (
                        <a
                          href={programme.poster.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {programme.poster.name}
                        </a>
                      ) : (
                        programme.poster.name
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{programme.poster.size}</span>
                  </li>
                </ul>
              </div>
            )}

            {(programme.status === "booked" || programme.status === "completed") && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Comments ({programme.comments.length})
                </h3>
                <div className="mt-4 space-y-4">
                  {programme.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  )}
                  {programme.comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {c.author
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 rounded-lg border bg-background p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium">{c.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(c.at), "MMM d, HH:mm")}
                          </div>
                        </div>
                        <p className="mt-1 text-sm">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment…"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={addComment}>
                      Add comment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {user.role === "union" && programme.status === "completed" && !programme.rating && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Rate this programme</h3>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} type="button">
                      <Star
                        className={cn(
                          "h-6 w-6 cursor-pointer",
                          s <= rating ? "fill-warning text-warning" : "text-muted-foreground",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  className="mt-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Remarks…"
                  rows={2}
                />
                <Button className="mt-3" size="sm" onClick={submitRating}>
                  Submit rating
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold">Approval Timeline</h3>
              <ol className="mt-4 space-y-4">
                {programme.timeline.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <div
                      className={cn(
                        "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs",
                        t.done
                          ? "border-success bg-success text-success-foreground"
                          : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {t.done ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn("text-sm", t.done ? "font-medium" : "text-muted-foreground")}
                      >
                        {t.label}
                      </div>
                      {t.at && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(t.at), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {canApprove && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Approval Actions</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.role === "union"
                    ? "Review and approve for faculty sign-off."
                    : "Provide final approval and confirm booking."}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    onClick={approve}
                    className="bg-success text-success-foreground hover:bg-success/90"
                  >
                    <Check className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={reject}>
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            )}

            {programme.rating && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Rating</h3>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-5 w-5",
                        s <= (programme.rating ?? 0)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{programme.rating?.toFixed(1)}</span>
                </div>
                {programme.ratingRemarks && (
                  <p className="mt-2 text-sm text-muted-foreground">{programme.ratingRemarks}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
