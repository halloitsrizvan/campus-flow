"use client";

import Link from "next/link";
import { useApp, venueName } from "@/lib/mock";
import { format } from "date-fns";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Image as ImageIcon,
  MessageSquare,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PublicProgrammePage() {
  const params = useParams();
  const id =
    typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const router = useRouter();

  const programmes = useApp((s) => s.programmes);
  const updateProgramme = useApp((s) => s.updateProgramme);
  const user = useApp((s) => s.user);

  const programme = programmes.find((p) => p.id === id);

  const [commentName, setCommentName] = useState(user?.name || "");
  const [commentText, setCommentText] = useState("");

  if (!programme) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Programme not found</h2>
        <p className="text-muted-foreground mb-6">
          This programme may have been removed or does not exist.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      toast.error("Please provide both name and comment.");
      return;
    }

    const newComment = {
      id: `c${Date.now()}`,
      author: commentName.trim(),
      role: user ? user.role : "Public Guest",
      text: commentText.trim(),
      at: new Date().toISOString(),
    };

    updateProgramme(programme!.id, { comments: [...programme!.comments, newComment] });
    setCommentText("");
    toast.success("Comment added!");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,oklch(0.9_0.06_277/_0.6),transparent_50%),radial-gradient(circle_at_85%_90%,oklch(0.92_0.07_165/_0.55),transparent_45%)]"
      />
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/40 px-6 backdrop-blur-md shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => router.push("/")}
        >
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

      <main className="relative mx-auto max-w-5xl px-6 py-12">
        <Button
          variant="ghost"
          asChild
          className="mb-8 -ml-4 text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="space-y-10">
          {/* Header section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between mb-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent pb-1">
                  {programme.name}
                </h1>
                <p className="mt-3 text-lg font-medium text-primary uppercase tracking-widest text-sm">
                  {programme.wing}
                </p>
              </div>
              <Badge
                variant={programme.status === "completed" ? "secondary" : "default"}
                className="text-sm px-4 py-1.5 shadow-sm self-start"
              >
                {programme.status === "completed" ? "Completed" : "Upcoming"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm shadow-sm transition-colors hover:bg-card/60 hover:text-foreground">
                <CalendarDays className="h-4 w-4 text-primary/80" />
                <span className="font-medium">
                  {format(new Date(programme.date), "PPP")} • {programme.startTime} -{" "}
                  {programme.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm shadow-sm transition-colors hover:bg-card/60 hover:text-foreground">
                <MapPin className="h-4 w-4 text-primary/80" />
                <span className="font-medium">{venueName(programme.venueId)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">
              {programme.purpose && (
                <section className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">About this event</h2>
                  <div className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-wrap text-base leading-relaxed">
                    {programme.purpose}
                  </div>
                </section>
              )}

              {/* Photo Gallery & Poster */}
              {(programme.poster?.url ||
                (programme.review?.photoGallery && programme.review.photoGallery.length > 0)) && (
                <section className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-primary/80" /> Media Gallery
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {programme.poster?.url && (
                      <div className="space-y-3 group">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-card shadow-sm relative">
                          <img
                            src={programme.poster.url}
                            alt="Event Poster"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-medium">Event Poster</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {programme.review?.photoGallery.map((url, i) => (
                      <div key={i} className="space-y-3 group">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-card shadow-sm relative">
                          <img
                            src={url}
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-medium">Event Photo {i + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar content */}
            <div className="space-y-6">
              {programme.guests && programme.guests.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md p-6 shadow-sm hover:bg-card/50 transition-colors">
                  <h3 className="font-bold text-lg mb-4">Special Guests</h3>
                  <ul className="space-y-4">
                    {programme.guests.map((g, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary shrink-0">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-none">{g.name}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1.5 uppercase tracking-wide">
                            {g.position}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {programme.category && programme.category.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md p-6 shadow-sm hover:bg-card/50 transition-colors">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {programme.category.map((c, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-background/50 border-white/10 backdrop-blur-sm px-3 py-1"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <section className="pt-10 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-primary/80" /> Conversation
            </h2>

            <div className="grid gap-8 md:grid-cols-5">
              <div className="md:col-span-3 space-y-6">
                {programme.comments.length === 0 ? (
                  <div className="text-center py-12 bg-card/20 backdrop-blur-sm rounded-3xl border border-white/10 border-dashed">
                    <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-sm font-medium">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {programme.comments.map((c) => (
                      <div
                        key={c.id}
                        className="flex gap-4 p-5 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:bg-card/60 hover:-translate-y-0.5"
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/20 text-primary text-sm font-bold uppercase tracking-wider">
                          {c.author.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1">
                            <span className="font-bold text-base truncate">{c.author}</span>
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-background/50 px-2 py-1 rounded-md">
                              {format(new Date(c.at), "MMM d, yyyy • h:mm a")}
                            </span>
                          </div>
                          {c.role && c.role !== "Public Guest" && (
                            <Badge
                              variant="secondary"
                              className="mb-3 text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-semibold border-none"
                            >
                              {c.role}
                            </Badge>
                          )}
                          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words mt-1">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <form
                  onSubmit={addComment}
                  className="rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl p-6 shadow-xl sticky top-24"
                >
                  <h3 className="font-bold text-xl mb-5">Leave a comment</h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your name"
                        disabled={!!user}
                        className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
                      />
                      {user && (
                        <p className="text-xs text-muted-foreground">
                          Posting as{" "}
                          <span className="font-medium text-foreground">{user.name}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="comment"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        Comment
                      </Label>
                      <Textarea
                        id="comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="What do you think about this event?"
                        rows={5}
                        className="bg-background/50 border-white/10 focus-visible:ring-primary/50 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
