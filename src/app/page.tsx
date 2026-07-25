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
    <div className="min-h-screen bg-[#15151e] text-white selection:bg-[#c8ff2e] selection:text-black font-sans pb-24">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12 backdrop-blur-xl border-b border-white/5 bg-[#15151e]/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#c8ff2e] rounded text-black flex items-center justify-center font-bold text-xl">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            Venue<span className="text-[#c8ff2e]">Hub</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70 uppercase tracking-widest">
          <Link href="#" className="text-white hover:text-[#c8ff2e] transition-colors">
            Home
          </Link>
          <Link href="#events" className="hover:text-[#c8ff2e] transition-colors">
            Events
          </Link>
          <Link href="#schedule" className="hover:text-[#c8ff2e] transition-colors">
            Schedule
          </Link>
          <Link href="#venues" className="hover:text-[#c8ff2e] transition-colors">
            Venue
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold flex items-center gap-2 text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-[#7a52f4] hover:bg-[#6841da] transition-all text-white font-semibold flex items-center gap-2 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16">
        {/* HERO SECTION */}
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12">
            Book{" "}
            <span className="inline-flex items-center justify-center bg-[#7a52f4] w-[0.8em] h-[0.8em] rounded-2xl mx-2 align-middle -rotate-12">
              <CalendarDays className="w-1/2 h-1/2 text-white" />
            </span>{" "}
            And Explore
            <br />
            Upcoming{" "}
            <ArrowRight className="inline-block text-[#c8ff2e] w-[0.8em] h-[0.8em] -rotate-45" />{" "}
            Events
          </h1>

          <div className="grid md:grid-cols-12 gap-6 mt-16 max-w-5xl mx-auto">
            {/* Left Sponsor Card */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#c8ff2e] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div>
                <h3 className="text-[#c8ff2e] font-bold text-sm uppercase tracking-widest mb-6">
                  Featured By
                </h3>
                <div className="space-y-4 text-white/40 font-bold text-xl uppercase">
                  <p className="hover:text-white transition-colors cursor-pointer">Campus Flow</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Student Union</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Lisan</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgNTBBMDAgNDAgMCAxIDEgOTAgNTBBMDAgNDAgMCAxIDEgMTAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0M4RkYyRSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiIC8+PC9zdmc+')] bg-contain bg-no-repeat bg-center animate-[spin_10s_linear_infinite]">
                <div className="w-12 h-12 bg-[#c8ff2e] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(200,255,46,0.5)]">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
            </div>

            {/* Right Countdown Card */}
            <div className="md:col-span-7 bg-[#21212e] border border-white/10 rounded-3xl p-8 flex flex-col justify-between items-start text-left">
              <p className="text-lg text-white/70 mb-8 max-w-sm leading-relaxed">
                Welcome to VenueHub, the ultimate destination for discovering and booking upcoming
                events across campus.
              </p>

              <div className="flex items-end gap-8 mb-10 w-full justify-between">
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">
                      Hours
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">
                      Minute
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">
                      Second
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="w-16 h-16 bg-white/10 rounded-xl p-2 inline-block mb-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white/80">
                      <path d="M3 3h8v8H3zm2 2v4h4V5zM13 3h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 13h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm2-4h2v2h-2zm2-2h2v2h-2zm0 4h2v2h-2z" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold text-[#c8ff2e] uppercase tracking-widest">
                    Get Yours
                  </div>
                </div>
              </div>

              <div className="w-full flex">
                <button className="flex-1 bg-[#c8ff2e] text-black font-black uppercase tracking-wider py-4 rounded-l-2xl text-sm sm:text-base hover:bg-[#b0e620] transition-colors">
                  {nextEvent ? `Next: ${nextEvent.name}` : "Book Your Seat"}
                </button>
                <button className="bg-[#7a52f4] px-6 rounded-r-2xl flex items-center justify-center hover:bg-[#6841da] transition-colors">
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
              the event
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              Once you have found an event you are interested in, you can view all the details and
              information you need, including the event date, time, location, lineup, speakers, and
              agenda.
            </p>
            <Link
              href="#events"
              className="inline-flex items-center gap-3 bg-[#7a52f4] hover:bg-[#6841da] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-transform hover:scale-105"
            >
              Get Ticket <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="md:w-1/2 relative flex justify-center">
            {/* Big Graphic Ticket */}
            <div className="relative w-72 h-48 rotate-12 transition-transform hover:rotate-6 duration-500">
              {/* Back shadow ticket */}
              <div
                className="absolute inset-0 bg-[#21212e] rounded-3xl -rotate-12 transform origin-center border border-white/5"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 70%, 10% 70%, 10% 30%, 0 30%)",
                }}
              />
              {/* Front ticket */}
              <div
                className="absolute inset-0 bg-[#c8ff2e] rounded-3xl shadow-2xl flex items-center"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 70%, 10% 70%, 10% 30%, 0 30%)",
                }}
              >
                <div className="border-l-4 border-dashed border-black/20 h-full ml-[25%]" />
                <div className="pl-6 font-black text-4xl text-black uppercase tracking-tighter -rotate-90 origin-left translate-y-12 translate-x-4">
                  Ticket
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVER UPCOMING EVENTS */}
        <section id="events" className="my-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-12">
            Discover Upcoming Events
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#7a52f4] rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative group h-80">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-0 group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay" />
              <div className="z-10">
                <h3 className="text-2xl font-black uppercase tracking-wide mb-4">
                  Explore The Location
                </h3>
                <p className="text-white/80 font-medium leading-relaxed max-w-sm">
                  Our platform is designed to make it easy for you to find and book events that
                  match your interests and preferences.
                </p>
              </div>
              <button className="z-10 mt-auto self-start flex items-center gap-4 bg-[#c8ff2e] text-black font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white transition-colors">
                Explore The Location
                <span className="bg-[#7a52f4] text-white p-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            <div className="bg-[#21212e] rounded-[2rem] p-10 overflow-hidden relative group h-80 border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"
                alt="Audience"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
              />
            </div>

            <div className="bg-[#21212e] rounded-[2rem] p-10 overflow-hidden relative group h-80 border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1523580494112-071dcb851aa0?auto=format&fit=crop&q=80"
                alt="Conference"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
              />
            </div>

            <div className="bg-[#c8ff2e] rounded-[2rem] p-10 flex flex-col justify-between h-80">
              <div className="text-black">
                <p className="font-bold text-lg leading-snug">
                  SIMPLE SEARCH FUNCTION, YOU CAN BROWSE THROUGH A RANGE OF EVENTS AND FILTER
                  RESULTS BY DATE, LOCATION, CATEGORY, AND MORE.
                </p>
              </div>
              <button className="mt-auto self-start flex items-center gap-3 bg-[#7a52f4] hover:bg-[#6841da] text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                Explore <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* VENUE CALENDAR */}
        <section id="schedule" className="my-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Venue Schedule</h2>
              <p className="text-white/60 text-lg max-w-xl">
                Check our master calendar to see what's happening and when venues are booked across
                the campus.
              </p>
            </div>
          </div>

          <div className="bg-[#21212e]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10">
            {/* Render the calendar component here */}
            {/* The calendar is normally light themed, so we'll wrap it in a div that enforces dark mode aesthetics if necessary, or just rely on its own styling which we'll tweak globally or locally */}
            <div className="dark">
              <VenueCalendar className="text-foreground" />
            </div>
          </div>
        </section>

        {/* GET YOUR FIRST TICKET CTA */}
        <section className="my-32">
          <div className="bg-[#21212e] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10">
            {/* Background elements */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#7a52f4] rounded-full blur-[100px] opacity-30" />
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10 md:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-8">
                Get Your
                <br />
                First Ticket
              </h2>
              <button className="flex items-center gap-3 bg-[#7a52f4] hover:bg-[#6841da] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-transform hover:scale-105">
                Get Ticket <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10 md:w-1/3 flex flex-col items-center md:items-end text-right">
              <p className="text-white/60 text-lg mb-12">
                Our platform is designed to make it easy for you to find and book events that match
                your interests and preferences.
              </p>

              <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-[#c8ff2e] rounded-full animate-spin-slow"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 61% 10%, 75% 6%, 82% 19%, 96% 23%, 95% 38%, 100% 50%, 95% 62%, 96% 77%, 82% 81%, 75% 94%, 61% 90%, 50% 100%, 39% 90%, 25% 94%, 18% 81%, 4% 77%, 5% 62%, 0% 50%, 5% 38%, 4% 23%, 18% 19%, 25% 6%, 39% 10%)",
                  }}
                />
                <div className="w-16 h-16 bg-[#15151e] rounded-full flex items-center justify-center z-10">
                  <ArrowUpRight className="text-white w-6 h-6" />
                </div>
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] z-20 scale-[0.85]"
                >
                  <path
                    id="circlePath"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="transparent"
                  />
                  <text className="text-[14px] font-black uppercase tracking-[0.2em]" fill="black">
                    <textPath href="#circlePath">Book A Seat • Book A Seat •</textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20 pt-16 pb-8 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#c8ff2e] rounded text-black flex items-center justify-center font-bold text-xl">
              V
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              Venue<span className="text-[#c8ff2e]">Hub</span>
            </span>
          </div>

          <div className="flex-1 max-w-md w-full">
            <p className="text-sm font-bold uppercase mb-4">Subscribe to our newsletter</p>
            <div className="flex w-full">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="flex-1 bg-[#c8ff2e] text-black placeholder:text-black/60 px-6 py-3 rounded-l-full font-bold focus:outline-none"
              />
              <button className="bg-[#7a52f4] px-6 rounded-r-full flex items-center justify-center hover:bg-[#6841da] transition-colors">
                <ArrowUpRight className="text-white w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-3 text-sm font-bold uppercase text-right">
            <Link href="#" className="hover:text-[#c8ff2e] transition-colors">
              Home
            </Link>
            <Link href="#events" className="hover:text-[#c8ff2e] transition-colors">
              Events
            </Link>
            <Link href="#schedule" className="hover:text-[#c8ff2e] transition-colors">
              Schedule
            </Link>
            <Link href="#venues" className="hover:text-[#c8ff2e] transition-colors">
              Venue
            </Link>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-medium">
          <p>© 2026 Campus Flow. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Terms & Agreements
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
