import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "wing" | "union" | "teacher" | "super_admin";

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  wing?: string;
  union?: string;
  avatar?: string;
}

export type ProgrammeStatus =
  | "draft"
  | "submitted"
  | "union_approved"
  | "teacher_approved"
  | "booked"
  | "rejected"
  | "completed";

export interface Programme {
  id: string;
  name: string;
  category: string[];
  purpose: string;
  wing: string;
  wingId: string;
  date: string; // ISO
  startTime: string;
  endTime: string;
  venueId: string;
  audience: string;
  guests?: { name: string; position: string }[];
  equipment?: string[];
  budget: { item: string; amount: number }[];
  status: ProgrammeStatus;
  createdAt: string;
  poster?: { name: string; size: string; url?: string };
  comments: { id: string; author: string; role: Role; text: string; at: string }[];
  timeline: { label: string; at?: string; done: boolean }[];
  rating?: number;
  ratingRemarks?: string;
  committeeApproved?: boolean;
  teacherApproved?: boolean;
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
export const VENUES: Venue[] = [];

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

export const PROGRAMMES: Programme[] = [];

export const NOTIFICATIONS: Notification[] = [];

// ---- Zustand store (client-only mutable state with DB persistence) ----
interface AppState {
  user: User | null;
  users: User[];
  programmes: Programme[];
  venues: Venue[];
  notifications: Notification[];
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  fetchInitialData: () => Promise<void>;
  addProgramme: (p: Programme) => void;
  updateProgramme: (id: string, patch: Partial<Programme>) => void;
  removeProgramme: (id: string) => Promise<void>;
  addVenue: (v: Venue) => void;
  updateVenue: (id: string, patch: Partial<Venue>) => void;
  removeVenue: (id: string) => void;
  addUser: (u: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  removeUser: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      programmes: [],
      venues: [],
      notifications: [],
      login: async (username, password) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to login");
        }

        const loggedInUser = await res.json();
        set({ user: loggedInUser });
      },
      logout: () => set({ user: null }),
      fetchInitialData: async () => {
        console.log(
          "fetchInitialData: initiating fetch requests to /api/users, /api/venues, /api/programmes, /api/notifications...",
        );
        try {
          const [resUsers, resVenues, resProgrammes, resNotifications] = await Promise.all([
            fetch("/api/users").then((r) => r.json()),
            fetch("/api/venues").then((r) => r.json()),
            fetch("/api/programmes").then((r) => r.json()),
            fetch("/api/notifications").then((r) => r.json()),
          ]);
          console.log("fetchInitialData: fetch results loaded successfully:", {
            usersCount: Array.isArray(resUsers) ? resUsers.length : "not an array",
            venuesCount: Array.isArray(resVenues) ? resVenues.length : "not an array",
            programmesCount: Array.isArray(resProgrammes) ? resProgrammes.length : "not an array",
            notificationsCount: Array.isArray(resNotifications)
              ? resNotifications.length
              : "not an array",
          });
          set({
            users: Array.isArray(resUsers) ? resUsers : [],
            venues: Array.isArray(resVenues) ? resVenues : [],
            programmes: Array.isArray(resProgrammes) ? resProgrammes : [],
            notifications: Array.isArray(resNotifications) ? resNotifications : [],
          });
        } catch (err) {
          console.error("Failed to fetch initial database data:", err);
        }
      },
      addProgramme: async (p) => {
        const res = await fetch("/api/programmes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        const created = await res.json();
        if (!res.ok) {
          throw new Error(created.error || "Failed to add programme");
        }
        set((s) => ({ programmes: [created, ...s.programmes] }));
      },
      updateProgramme: async (id, patch) => {
        try {
          const res = await fetch(`/api/programmes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
          const updated = await res.json();
          set((s) => ({
            programmes: s.programmes.map((p) => (p.id === id ? updated : p)),
          }));
        } catch (err) {
          console.error("Failed to update programme:", err);
        }
      },
      removeProgramme: async (id) => {
        try {
          const res = await fetch(`/api/programmes/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete programme");
          set((s) => ({ programmes: s.programmes.filter((p) => p.id !== id) }));
        } catch (err) {
          console.error("Failed to delete programme:", err);
          throw err;
        }
      },
      addVenue: async (v) => {
        try {
          const res = await fetch("/api/venues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v),
          });
          const created = await res.json();
          set((s) => ({ venues: [...s.venues, created] }));
        } catch (err) {
          console.error("Failed to add venue:", err);
        }
      },
      updateVenue: async (id, patch) => {
        try {
          const res = await fetch(`/api/venues/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
          const updated = await res.json();
          set((s) => ({
            venues: s.venues.map((v) => (v.id === id ? updated : v)),
          }));
        } catch (err) {
          console.error("Failed to update venue:", err);
        }
      },
      removeVenue: async (id) => {
        try {
          await fetch(`/api/venues/${id}`, { method: "DELETE" });
          set((s) => ({ venues: s.venues.filter((v) => v.id !== id) }));
        } catch (err) {
          console.error("Failed to delete venue:", err);
        }
      },
      addUser: async (u) => {
        try {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(u),
          });
          if (!res.ok) throw new Error("Failed to add user");
          const created = await res.json();
          set((s) => ({ users: [...s.users, created] }));
        } catch (err) {
          console.error("Failed to add user:", err);
          throw err;
        }
      },
      updateUser: async (id, patch) => {
        try {
          const res = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
          if (!res.ok) throw new Error("Failed to update user");
          const updated = await res.json();
          set((s) => ({
            users: s.users.map((u) => (u.id === id ? updated : u)),
          }));
        } catch (err) {
          console.error("Failed to update user:", err);
          throw err;
        }
      },
      removeUser: async (id) => {
        try {
          const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete user");
          set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
        } catch (err) {
          console.error("Failed to delete user:", err);
          throw err;
        }
      },
      markAllNotificationsRead: async () => {
        try {
          const res = await fetch("/api/notifications", { method: "PUT" });
          const updatedList = await res.json();
          set({ notifications: updatedList });
        } catch (err) {
          console.error("Failed to mark notifications read:", err);
        }
      },
    }),
    {
      name: "campus-flow-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export function venueName(id: string): string {
  const v = useApp.getState().venues.find((v) => v.id === id);
  return v?.name ?? (id || "Unknown venue");
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
      return { label: "Teacher Approved", cls: "bg-primary/20 text-primary border-primary/40" };
    case "booked":
      return { label: "Booked", cls: "bg-success/20 text-success border-success/40" };
    case "rejected":
      return { label: "Rejected", cls: "bg-destructive/10 text-destructive border-destructive/30" };
    case "completed":
      return { label: "Completed", cls: "bg-success/10 text-success border-success/30" };
    default:
      return { label: "Unknown", cls: "bg-muted text-muted-foreground" };
  }
}

export function getScopedProgrammes(programmes: Programme[], user: User | null, users: User[]): Programme[] {
  if (!user) return [];
  
  if (user.role === "wing") {
    return programmes.filter((p) => p.wing === user.wing || p.wingId === user.id);
  }
  
  if (user.role === "union") {
    const unionWings = users.filter((u) => u.role === "wing" && u.union === user.union).map((u) => u.id);
    return programmes.filter((p) => unionWings.includes(p.wingId));
  }
  
  if (user.role === "teacher") {
    // If teacher has a union assigned, only show programmes from wings in that union
    let teacherWings: string[] | null = null;
    if (user.union) {
      teacherWings = users.filter((u) => u.role === "wing" && u.union === user.union).map((u) => u.id);
    }
    
    return programmes.filter((p) => {
      if (teacherWings && !teacherWings.includes(p.wingId)) return false;
      // Only show after union approval
      return p.timeline.some((t) => t.label.toLowerCase().includes("union") && t.done);
    });
  }
  
  return programmes;
}
