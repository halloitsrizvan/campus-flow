"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [reviewData, setReviewData] = useState<{
    tier: string;
    photoGallery: string[];
    mark: string;
  }>({
    tier: "",
    photoGallery: [],
    mark: "",
  });
  const [newPhoto, setNewPhoto] = useState("");

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
          if (t.label.toLowerCase().includes("teacher"))
            return { ...t, done: true, at: new Date().toISOString() };
          return t;
        }),
      });
      toast.success("Approved by Union Teacher");
    } else if (user!.role === "principal") {
      const needsMic = programme!.equipment?.includes("Mic");
      updateProgramme(programme!.id, {
        status: needsMic ? "principal_approved" : "booked",
        timeline: programme!.timeline.map((t) => {
          if (
            t.label.toLowerCase().includes("principal") ||
            (!needsMic && t.label.toLowerCase() === "booked")
          )
            return { ...t, done: true, at: new Date().toISOString() };
          return t;
        }),
      });
      toast.success(needsMic ? "Approved by Principal" : "Approved by Principal — venue booked");
    } else if (user!.role === "mic_manager") {
      updateProgramme(programme!.id, {
        status: "booked",
        timeline: programme!.timeline.map((t) => {
          if (t.label.toLowerCase().includes("mic") || t.label.toLowerCase() === "booked")
            return { ...t, done: true, at: new Date().toISOString() };
          return t;
        }),
      });
      toast.success("Approved by Mic Manager — venue booked");
    }
  }

  function reject() {
    updateProgramme(programme!.id, { status: "rejected" });
    toast.error("Programme rejected");
  }

  const canApprove =
    (user.role === "union" && programme.status === "submitted") ||
    (user.role === "teacher" && programme.status === "union_approved") ||
    (user.role === "principal" && programme.status === "teacher_approved") ||
    (user.role === "mic_manager" && programme.status === "principal_approved");

  function submitReview() {
    if (!reviewData.tier || !reviewData.mark) {
      toast.error("Please fill in tier and mark.");
      return;
    }
    updateProgramme(programme!.id, {
      status: "completed",
      review: reviewData,
    });
    toast.success("Review submitted");
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
          description={`${programme.wing} · ${programme.category.join(", ")}`}
          action={
            <div className="flex items-center gap-3">
              <StatusBadge status={programme.status} />
              {["wing", "super_admin", "union", "teacher"].includes(user.role) &&
                (programme.status === "submitted" ||
                  programme.status === "draft" ||
                  (user.role === "union" &&
                    (programme.status === "booked" || programme.status === "completed"))) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/programmes/${programme.id}/edit`)}
                  >
                    Edit
                  </Button>
                )}
            </div>
          }
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

            {true && (
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

            {user.role === "union" && (programme.status === "booked" || programme.status === "completed") && !programme.review && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Post-Event Review</h3>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select
                      value={reviewData.tier}
                      onValueChange={(v) => setReviewData({ ...reviewData, tier: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Tier">1st Tier</SelectItem>
                        <SelectItem value="2nd Tier">2nd Tier</SelectItem>
                        <SelectItem value="Publication">Publication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Photo Gallery (Image URLs)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://..."
                        value={newPhoto}
                        onChange={(e) => setNewPhoto(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          if (newPhoto) {
                            setReviewData({
                              ...reviewData,
                              photoGallery: [...reviewData.photoGallery, newPhoto],
                            });
                            setNewPhoto("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {reviewData.photoGallery.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {reviewData.photoGallery.map((url, i) => (
                          <div key={i} className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs">
                            <span className="truncate max-w-[150px]">{url}</span>
                            <button
                              onClick={() =>
                                setReviewData({
                                  ...reviewData,
                                  photoGallery: reviewData.photoGallery.filter((_, idx) => idx !== i),
                                })
                              }
                            >
                              <X className="h-3 w-3 hover:text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Mark</Label>
                    <Input
                      placeholder="e.g. A, B, 90/100"
                      value={reviewData.mark}
                      onChange={(e) => setReviewData({ ...reviewData, mark: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="mt-6" size="sm" onClick={submitReview}>
                  Submit Review
                </Button>
              </div>
            )}

            {programme.review && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Event Review</h3>
                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Tier</div>
                    <div className="font-medium">{programme.review.tier}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Mark</div>
                    <div className="font-medium">{programme.review.mark}</div>
                  </div>
                  {programme.review.photoGallery.length > 0 && (
                    <div className="sm:col-span-2">
                      <div className="text-xs text-muted-foreground">Photo Gallery</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {programme.review.photoGallery.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Image {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                    ? "Review and approve for union teacher sign-off."
                    : user.role === "teacher"
                      ? "Review and approve for principal sign-off."
                      : user.role === "principal"
                        ? "Review and approve for final or mic sign-off."
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
