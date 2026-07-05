// Mock data store for VenueHub. Swap for real API/Cloud calls later.
import { create } from "zustand";

export type Role = "wing" | "union" | "teacher";

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  wing?: string;
  avatar?: string;
}

export type ProgrammeStatus =
  | "draft"
  | "submitted"
  | "union_approved"
  | "teacher_approved"
  | "rejected"
  | "completed";

export interface Programme {
  id: string;
  name: string;
  category: string;
  purpose: string;
  wing: string;
  wingId: string;
  date: string; // ISO
  startTime: string;
  endTime: string;
  venueId: string;
  expectedStudents: number;
  guest?: string;
  equipment?: string;
  budget: number;
  status: ProgrammeStatus;
  createdAt: string;
  attachments?: { name: string; size: string }[];
  comments: { id: string; author: string; role: Role; text: string; at: string }[];
  timeline: { label: string; at?: string; done: boolean }[];
  rating?: number;
  ratingRemarks?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  active: boolean;
  blocked?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  at: string;
  read: boolean;
  type: "info" | "success" | "warning" | "danger";
}

// ---- Seed data ----
export const VENUES: Venue[] = [
  { id: "v1", name: "Main Auditorium", capacity: 500, location: "Block A, GF", active: true },
  { id: "v2", name: "Seminar Hall 1", capacity: 120, location: "Block B, 1F", active: true },
  { id: "v3", name: "Seminar Hall 2", capacity: 80, location: "Block B, 2F", active: true },
  { id: "v4", name: "Open Air Theatre", capacity: 800, location: "Campus Ground", active: true },
  { id: "v5", name: "Conference Room", capacity: 40, location: "Block C, 3F", active: true, blocked: true },
  { id: "v6", name: "Sports Ground", capacity: 1000, location: "North Campus", active: true },
];

export const CATEGORIES = [
  "Cultural",
  "Technical",
  "Sports",
  "Academic",
  "Workshop",
  "Seminar",
  "Competition",
];

export const WINGS = [
  { id: "w1", name: "Computer Science Wing" },
  { id: "w2", name: "Electronics Wing" },
  { id: "w3", name: "Cultural Committee" },
  { id: "w4", name: "Sports Committee" },
  { id: "w5", name: "Literary Club" },
  { id: "w6", name: "IEEE Chapter" },
];

const today = new Date();
const d = (offset: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
};

export const PROGRAMMES: Programme[] = [
  {
    id: "p1",
    name: "TechFest 2025",
    category: "Technical",
    purpose: "Annual technical festival with coding contests, robotics, and talks.",
    wing: "Computer Science Wing",
    wingId: "w1",
    date: d(3),
    startTime: "09:00",
    endTime: "17:00",
    venueId: "v1",
    expectedStudents: 350,
    guest: "Dr. R. Krishnan, IIT Madras",
    equipment: "Projector, Mic x4, Stage lighting",
    budget: 85000,
    status: "teacher_approved",
    createdAt: d(-10),
    attachments: [{ name: "poster.pdf", size: "1.2 MB" }, { name: "permission.pdf", size: "220 KB" }],
    comments: [
      { id: "c1", author: "Anita (Union)", role: "union", text: "Looks great. Budget approved.", at: d(-7) },
      { id: "c2", author: "Prof. Menon", role: "teacher", text: "Approved. Coordinate with security.", at: d(-5) },
    ],
    timeline: [
      { label: "Submitted by Wing", at: d(-10), done: true },
      { label: "Union Approved", at: d(-7), done: true },
      { label: "Teacher Approved", at: d(-5), done: true },
      { label: "Booked", at: d(-5), done: true },
    ],
  },
  {
    id: "p2",
    name: "Inter-College Debate",
    category: "Competition",
    purpose: "Debate competition across 12 partnering colleges.",
    wing: "Literary Club",
    wingId: "w5",
    date: d(7),
    startTime: "10:00",
    endTime: "16:00",
    venueId: "v2",
    expectedStudents: 90,
    budget: 22000,
    status: "union_approved",
    createdAt: d(-4),
    comments: [{ id: "c3", author: "Anita (Union)", role: "union", text: "Forwarded to faculty.", at: d(-2) }],
    timeline: [
      { label: "Submitted by Wing", at: d(-4), done: true },
      { label: "Union Approved", at: d(-2), done: true },
      { label: "Teacher Approved", done: false },
      { label: "Booked", done: false },
    ],
  },
  {
    id: "p3",
    name: "Cultural Night",
    category: "Cultural",
    purpose: "Music, dance, and drama showcase.",
    wing: "Cultural Committee",
    wingId: "w3",
    date: d(14),
    startTime: "18:00",
    endTime: "22:00",
    venueId: "v4",
    expectedStudents: 600,
    budget: 120000,
    status: "submitted",
    createdAt: d(-1),
    comments: [],
    timeline: [
      { label: "Submitted by Wing", at: d(-1), done: true },
      { label: "Union Approved", done: false },
      { label: "Teacher Approved", done: false },
      { label: "Booked", done: false },
    ],
  },
  {
    id: "p4",
    name: "AI Workshop",
    category: "Workshop",
    purpose: "Hands-on introduction to LLMs.",
    wing: "IEEE Chapter",
    wingId: "w6",
    date: d(-5),
    startTime: "09:00",
    endTime: "13:00",
    venueId: "v3",
    expectedStudents: 60,
    budget: 15000,
    status: "completed",
    createdAt: d(-30),
    rating: 4.5,
    ratingRemarks: "Well organised, active participation.",
    comments: [],
    timeline: [
      { label: "Submitted", at: d(-30), done: true },
      { label: "Union Approved", at: d(-28), done: true },
      { label: "Teacher Approved", at: d(-25), done: true },
      { label: "Completed", at: d(-5), done: true },
    ],
  },
  {
    id: "p5",
    name: "Robotics Expo",
    category: "Technical",
    purpose: "Student robotics project exhibition.",
    wing: "Electronics Wing",
    wingId: "w2",
    date: d(2),
    startTime: "11:00",
    endTime: "16:00",
    venueId: "v2",
    expectedStudents: 150,
    budget: 40000,
    status: "rejected",
    createdAt: d(-6),
    comments: [{ id: "c4", author: "Anita (Union)", role: "union", text: "Venue conflict; please pick another date.", at: d(-3) }],
    timeline: [
      { label: "Submitted", at: d(-6), done: true },
      { label: "Rejected by Union", at: d(-3), done: true },
    ],
  },
  {
    id: "p6",
    name: "Basketball Tournament",
    category: "Sports",
    purpose: "Intra-college basketball championship.",
    wing: "Sports Committee",
    wingId: "w4",
    date: d(10),
    startTime: "08:00",
    endTime: "18:00",
    venueId: "v6",
    expectedStudents: 200,
    budget: 30000,
    status: "teacher_approved",
    createdAt: d(-8),
    comments: [],
    timeline: [
      { label: "Submitted", at: d(-8), done: true },
      { label: "Union Approved", at: d(-6), done: true },
      { label: "Teacher Approved", at: d(-4), done: true },
      { label: "Booked", at: d(-4), done: true },
    ],
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Programme Approved", message: "TechFest 2025 was approved by Prof. Menon.", at: d(-5), read: false, type: "success" },
  { id: "n2", title: "New Submission", message: "Cultural Night is pending review.", at: d(-1), read: false, type: "info" },
  { id: "n3", title: "Programme Rejected", message: "Robotics Expo was rejected — venue conflict.", at: d(-3), read: true, type: "danger" },
  { id: "n4", title: "Venue Blocked", message: "Conference Room blocked for maintenance.", at: d(-2), read: true, type: "warning" },
  { id: "n5", title: "Comment Added", message: "Anita commented on Inter-College Debate.", at: d(-2), read: false, type: "info" },
];

// ---- Zustand store (client-only mutable state) ----
interface AppState {
  user: User | null;
  programmes: Programme[];
  venues: Venue[];
  notifications: Notification[];
  login: (username: string, role: Role) => void;
  logout: () => void;
  addProgramme: (p: Programme) => void;
  updateProgramme: (id: string, patch: Partial<Programme>) => void;
  addVenue: (v: Venue) => void;
  updateVenue: (id: string, patch: Partial<Venue>) => void;
  removeVenue: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useApp = create<AppState>((set) => ({
  user: null,
  programmes: PROGRAMMES,
  venues: VENUES,
  notifications: NOTIFICATIONS,
  login: (username, role) => {
    const names: Record<Role, string> = {
      wing: "Rahul Menon",
      union: "Anita Sharma",
      teacher: "Prof. K. Menon",
    };
    const wings: Record<Role, string | undefined> = {
      wing: "Computer Science Wing",
      union: undefined,
      teacher: undefined,
    };
    set({
      user: {
        id: "u1",
        username,
        name: names[role],
        role,
        wing: wings[role],
      },
    });
  },
  logout: () => set({ user: null }),
  addProgramme: (p) => set((s) => ({ programmes: [p, ...s.programmes] })),
  updateProgramme: (id, patch) =>
    set((s) => ({
      programmes: s.programmes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  addVenue: (v) => set((s) => ({ venues: [...s.venues, v] })),
  updateVenue: (id, patch) =>
    set((s) => ({ venues: s.venues.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
  removeVenue: (id) => set((s) => ({ venues: s.venues.filter((v) => v.id !== id) })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));

export function venueName(id: string): string {
  return VENUES.find((v) => v.id === id)?.name ?? "Unknown venue";
}

export function statusMeta(s: ProgrammeStatus) {
  switch (s) {
    case "draft":
      return { label: "Draft", cls: "bg-muted text-muted-foreground border-border" };
    case "submitted":
      return { label: "Submitted", cls: "bg-info/10 text-info border-info/30" };
    case "union_approved":
      return { label: "Union Approved", cls: "bg-primary/10 text-primary border-primary/30" };
    case "teacher_approved":
      return { label: "Booked", cls: "bg-success/15 text-success border-success/30" };
    case "rejected":
      return { label: "Rejected", cls: "bg-destructive/10 text-destructive border-destructive/30" };
    case "completed":
      return { label: "Completed", cls: "bg-accent text-accent-foreground border-border" };
  }
}
