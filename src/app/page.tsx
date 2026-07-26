"use client";

import Link from "next/link";
import { useApp, venueName } from "@/lib/mock";
import { format } from "date-fns";
import { CalendarDays, MapPin, ArrowRight, Ticket, ArrowUpRight, Play, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { VenueCalendar } from "@/components/venue-calendar";

export default function IndexPage() {
  const programmes = useApp((s) => s.programmes);
  const user = useApp((s) => s.user);

  const publicProgrammes = programmes
    .filter((p) => p.status === "booked" || p.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Find the next upcoming event for the countdown
  const now = new Date();
  const nextEvent = publicProgrammes.find((p) => new Date(p.date) > now);

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextEvent) return;

    const target = new Date(`${nextEvent.date}T${nextEvent.startTime}:00`);

    const interval = setInterval(() => {
      const current = new Date();
      const diff = target.getTime() - current.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-[#c8ff2e] selection:text-black font-sans pb-24 relative overflow-hidden">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12 bg-white border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#c8ff2e] border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black flex items-center justify-center font-black text-xl">
            V
          </div>
          <span className="text-xl font-black tracking-tight text-black uppercase">
            DIIA <span className="text-[#c8ff2e] stroke-black">Flow</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-black text-black uppercase tracking-widest">
          <Link href="#" className="hover:-translate-y-1 transition-transform border-b-2 border-transparent hover:border-black">
            Home
          </Link>
          <Link href="#events" className="hover:-translate-y-1 transition-transform border-b-2 border-transparent hover:border-black">
            Events
          </Link>
          <Link href="#schedule" className="hover:-translate-y-1 transition-transform border-b-2 border-transparent hover:border-black">
            Schedule
          </Link>
          <Link href="#venues" className="hover:-translate-y-1 transition-transform border-b-2 border-transparent hover:border-black">
            Venue
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-muted font-bold flex items-center gap-2 text-sm uppercase tracking-widest transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#00FFFF] hover:bg-[#00FFFF]/90 text-black font-bold flex items-center gap-2 text-sm uppercase tracking-widest transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 relative z-10">
        {/* HERO SECTION */}
        <section className="text-center mb-24 mt-12 relative">
          <div className="absolute top-10 left-10 hidden lg:block w-32 h-32 bg-[#ffcc00] rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mix-blend-multiply" />
          <div className="absolute bottom-10 right-20 hidden lg:block w-24 h-24 bg-[#c8ff2e] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12" />
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12 drop-shadow-md">
            Book{" "}
            <span className="inline-flex items-center justify-center bg-[#00FFFF] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[0.8em] h-[0.8em] rounded-sm mx-2 align-middle -rotate-12">
              <CalendarDays className="w-1/2 h-1/2 text-black" strokeWidth={3} />
            </span>{" "}
            And Explore
            <br />
            Upcoming{" "}
            <ArrowRight className="inline-block text-[#c8ff2e] stroke-black stroke-2 w-[0.8em] h-[0.8em] -rotate-45" />{" "}
            Events
          </h1>

          <div className="grid md:grid-cols-12 gap-6 mt-16 max-w-5xl mx-auto">
            {/* Left Sponsor Card */}
            <div className="md:col-span-5 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group transition-transform active:translate-x-[2px] active:translate-y-[2px]">
              <div>
                <h3 className="bg-black text-white inline-block px-3 py-1 font-black text-sm uppercase tracking-widest mb-6 border-2 border-black">
                  Featured By
                </h3>
                <div className="space-y-4 text-black font-black text-xl uppercase">
                  <p className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Campus Flow</p>
                  <p className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Student Union</p>
                  <p className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Lisan</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgNTBBMDAgNDAgMCAxIDEgOTAgNTBBMDAgNDAgMCAxIDEgMTAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiIC8+PC9zdmc+')] bg-contain bg-no-repeat bg-center animate-[spin_10s_linear_infinite]">
                <div className="w-12 h-12 bg-[#c8ff2e] border-2 border-black rounded-full flex items-center justify-center text-black">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
            </div>

            {/* Right Countdown Card */}
            <div className="md:col-span-7 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none p-8 flex flex-col justify-between items-start text-left transition-transform active:translate-x-[2px] active:translate-y-[2px]">
              <p className="text-xl text-black font-bold mb-8 max-w-sm leading-relaxed border-l-4 border-primary pl-4">
                Welcome to DIIA Flow, the ultimate destination for discovering and booking upcoming
                events across campus.
              </p>

              <div className="flex items-end gap-8 mb-10 w-full justify-between">
                <div className="flex gap-4 text-center">
                  <div className="bg-muted border-2 border-black p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-black text-black uppercase tracking-widest mt-1">
                      Hours
                    </div>
                  </div>
                  <div className="bg-muted border-2 border-black p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-black text-black uppercase tracking-widest mt-1">
                      Minute
                    </div>
                  </div>
                  <div className="bg-muted border-2 border-black p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-black text-black uppercase tracking-widest mt-1">
                      Second
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <button className="flex-1 bg-[#c8ff2e] text-black font-black uppercase tracking-wider py-4 text-sm sm:text-base hover:bg-[#c8ff2e]/80 transition-colors">
                  {nextEvent ? `Next: ${nextEvent.name}` : "Book Your Seat"}
                </button>
                <button className="bg-black px-6 flex items-center justify-center hover:bg-gray-800 transition-colors border-l-2 border-black">
                  <ArrowUpRight className="text-white w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DECIDE TO JOIN SECTION */}
        <section className="my-32 flex flex-col md:flex-row items-center gap-16 justify-between max-w-5xl mx-auto">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.1] mb-6">
              Decide to join
              <br />
              <span className="bg-[#ffcc00] px-2">the event</span>
            </h2>
            <p className="text-black font-semibold text-lg leading-relaxed mb-8 max-w-md">
              Once you have found an event you are interested in, you can view all the details and
              information you need, including the event date, time, location, lineup, speakers, and
              agenda.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-none bg-black text-white hover:bg-black/80 transition-transform active:translate-x-[2px] active:translate-y-[2px]">
                View All Events
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-[#c8ff2e] translate-x-4 translate-y-4 border-4 border-black" />
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
              alt="Event crowd"
              className="relative w-full aspect-square object-cover border-4 border-black"
            />
          </div>
        </section>

        {/* VENUE CALENDAR SECTION */}
        <section id="schedule" className="my-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4">
                Venue <span className="text-[#c8ff2e] stroke-black" style={{WebkitTextStroke: "2px black"}}>Schedule</span>
              </h2>
              <p className="text-black font-bold max-w-md">
                Check venue availability and see what's happening around campus.
              </p>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 bg-white border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              Full Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8">
            <div className="rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-4 [&_.bg-card]:bg-transparent [&_.border]:border-black [&_.rounded-xl]:rounded-none"><VenueCalendar /></div>
          </div>
        </section>

        {/* UPCOMING EVENTS GRID */}
        <section id="events" className="my-32">
          <div className="flex items-center justify-between mb-12 border-b-4 border-black pb-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase flex items-center gap-4">
              <span className="w-4 h-4 bg-[#c8ff2e] border-2 border-black inline-block animate-pulse"></span>
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-black uppercase tracking-widest hover:underline decoration-4 underline-offset-4"
            >
              View All
            </Link>
          </div>

          {publicProgrammes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicProgrammes.slice(0, 6).map((programme, i) => {
                const colors = ["bg-[#c8ff2e]", "bg-[#00FFFF]", "bg-[#ffcc00]", "bg-white", "bg-[#10b981]", "bg-[#3b82f6]"];
                const bgColor = colors[i % colors.length];
                return (
                  <div
                    key={programme.id}
                    className={`group ${bgColor} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform active:translate-x-[2px] active:translate-y-[2px]`}
                  >
                    <div className="aspect-[4/3] border-b-4 border-black relative overflow-hidden bg-white">
                      <div className="absolute inset-0 flex items-center justify-center font-black text-6xl opacity-10 uppercase text-center rotate-12">
                        {programme.wing}
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {format(new Date(programme.date), "MMM d")}
                        </span>
                        <span className="bg-white text-black px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {programme.startTime}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-bold mb-3 border-b-2 border-black/20 pb-2">
                          <MapPin className="w-4 h-4" />
                          {venueName(programme.venue)}
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-tight mb-2 group-hover:underline decoration-4 underline-offset-4 line-clamp-2">
                          {programme.name}
                        </h3>
                        <p className="text-black/80 font-semibold text-sm mb-6 line-clamp-2">
                          Organized by {programme.wing}
                        </p>
                      </div>
                      <Button className="w-full bg-black text-white border-2 border-black hover:bg-black/80 font-black uppercase tracking-widest group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <Ticket className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-muted border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-black uppercase mb-2">No Upcoming Events</h3>
              <p className="font-bold max-w-md mx-auto">
                There are currently no scheduled events. Please check back later or login to organize an event.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white pt-20 pb-10 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-[#c8ff2e] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black flex items-center justify-center font-black text-xl">
                  V
                </div>
                <span className="text-2xl font-black tracking-tight uppercase">DIIA Flow</span>
              </div>
              <p className="font-bold max-w-sm">
                The ultimate campus event management and venue booking system. Making events happen.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest mb-6 border-b-2 border-black inline-block pb-1">Quick Links</h4>
              <ul className="space-y-4 font-bold">
                <li><Link href="#" className="hover:translate-x-2 transition-transform inline-block">Home</Link></li>
                <li><Link href="#events" className="hover:translate-x-2 transition-transform inline-block">Events</Link></li>
                <li><Link href="#schedule" className="hover:translate-x-2 transition-transform inline-block">Schedule</Link></li>
                <li><Link href="/login" className="hover:translate-x-2 transition-transform inline-block text-[#c8ff2e] stroke-black">Login to Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest mb-6 border-b-2 border-black inline-block pb-1">Connect</h4>
              <ul className="space-y-4 font-bold">
                <li><a href="#" className="hover:translate-x-2 transition-transform inline-block">Twitter</a></li>
                <li><a href="#" className="hover:translate-x-2 transition-transform inline-block">Instagram</a></li>
                <li><a href="#" className="hover:translate-x-2 transition-transform inline-block">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-4 font-bold text-sm">
            <p>© {new Date().getFullYear()} DIIA Flow. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <Link href="#" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
