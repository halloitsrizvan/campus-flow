"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useApp, venueName } from "@/lib/mock";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, Ticket, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function EventDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const router = useRouter();
  
  const programmes = useApp((s) => s.programmes);
  const user = useApp((s) => s.user);
  const updateProgramme = useApp((s) => s.updateProgramme);
  const programme = programmes.find((p) => p.id === id);

  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");

  function addComment() {
    if (!comment.trim()) return;
    if (!user && !guestName.trim()) {
      toast.error("Please enter your name to comment");
      return;
    }
    const newComment = {
      id: `c${Date.now()}`,
      author: user ? user.name : guestName.trim(),
      role: user ? user.role : "Guest",
      text: comment.trim(),
      at: new Date().toISOString(),
    };
    updateProgramme(programme!.id, { comments: [...programme!.comments, newComment] });
    setComment("");
    if (!user) setGuestName("");
    toast.success("Comment added");
  }

  if (!programme) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-black font-sans pb-24 relative overflow-hidden flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black uppercase mb-4">Event Not Found</h2>
        <Button onClick={() => router.push("/")} className="px-6 py-2.5 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#c8ff2e] hover:bg-[#c8ff2e]/80 text-black font-black uppercase tracking-widest transition-transform active:translate-x-[2px] active:translate-y-[2px]">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans pb-24 relative overflow-hidden">
      <title>{`${programme.name} — DIIA Flow`}</title>
      <meta name="description" content="Public event details for DIIA Flow." />

      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
      </div>

      <header className="fixed top-0 w-full z-50 flex h-20 items-center justify-between px-6 lg:px-12 bg-white border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#c8ff2e] border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black flex items-center justify-center font-black text-xl">
            V
          </div>
          <span className="text-xl font-black tracking-tight text-black uppercase">
            DIIA <span className="text-[#c8ff2e] stroke-black">Flow</span>
          </span>
        </div>
        <Button onClick={() => router.push("/")} className="px-6 py-2.5 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-muted font-black uppercase tracking-widest text-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] text-black">
          Back to Home
        </Button>
      </header>

      <main className="pt-32 px-6 max-w-5xl mx-auto relative z-10 space-y-12">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:underline decoration-4 underline-offset-4"
        >
          <ArrowLeft className="h-5 w-5" /> Back to events
        </button>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden">
          {/* Header Info */}
          <div className="p-8 md:p-12 md:w-2/3 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#c8ff2e]">
            <div className="mb-4 inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {programme.category.join(", ")}
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">{programme.name}</h1>
            <p className="font-bold text-xl mb-2">Organized by {programme.wing}</p>
            {programme.audience && <p className="font-semibold text-black/80">Audience: {programme.audience}</p>}
          </div>

          {/* Quick Details */}
          <div className="p-8 md:w-1/3 bg-white flex flex-col justify-center space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-[#00FFFF] border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest mb-1">Date & Time</div>
                <div className="font-bold">{format(new Date(programme.date), "PPP")}</div>
                <div className="font-bold">{programme.startTime} – {programme.endTime}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-[#ffcc00] border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest mb-1">Venue</div>
                <div className="font-bold">{venueName(programme.venueId)}</div>
              </div>
            </div>

            {programme.guests && programme.guests.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest mb-1">Guests</div>
                  {programme.guests.map((g, i) => (
                    <div key={i} className="font-bold">
                      {g.name} <span className="font-normal text-sm">({g.position})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* About Section */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-4">
              <span className="w-4 h-4 bg-[#00FFFF] border-2 border-black inline-block" />
              About the Event
            </h2>
            <p className="font-bold text-lg leading-relaxed whitespace-pre-wrap">
              {programme.purpose}
            </p>
          </div>

          {/* Poster Section (if exists) */}
          {programme.poster && programme.poster.url && (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center justify-center bg-[#ffcc00]">
              <img
                src={programme.poster.url}
                alt={programme.poster.name}
                className="w-full h-auto border-4 border-black"
              />
            </div>
          )}
        </div>

        {/* Photo Gallery from Review */}
        {programme.review && programme.review.photoGallery && programme.review.photoGallery.length > 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 mt-12">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-4">
              <span className="w-4 h-4 bg-[#c8ff2e] border-2 border-black inline-block" />
              Event Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {programme.review.photoGallery.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-[4/3] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden group relative transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <img
                    src={url}
                    alt={`Gallery Image ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-[#c8ff2e] font-black uppercase tracking-widest text-sm border-2 border-[#c8ff2e] px-4 py-2">
                      View Full
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 mt-12">
          <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-4">
            <span className="w-4 h-4 bg-[#ffcc00] border-2 border-black inline-block" />
            Discussion
          </h2>
          
          <div className="space-y-6 mb-8">
            {programme.comments && programme.comments.length === 0 && (
              <p className="text-lg font-bold text-black/60">No comments yet. Be the first to share your thoughts!</p>
            )}
            {programme.comments && programme.comments.map((c) => (
              <div key={c.id} className="flex gap-4 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-none border-2 border-black bg-[#00FFFF] text-black text-lg font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {c.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                    <div className="text-base font-black uppercase">{c.author} <span className="text-xs text-black/60 font-bold ml-2 tracking-widest">({c.role})</span></div>
                    <div className="text-xs font-bold bg-[#c8ff2e] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {format(new Date(c.at), "MMM d, HH:mm")}
                    </div>
                  </div>
                  <p className="text-base font-bold whitespace-pre-wrap">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-4 border-black p-6 bg-[#FAFAFA] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase tracking-widest text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Add a Comment
            </h3>
            {!user && (
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your Name"
                className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            )}
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={addComment}
                className="px-8 py-6 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black hover:bg-black/80 text-white font-black uppercase tracking-widest transition-transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
