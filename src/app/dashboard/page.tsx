"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell, PageHeader } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { useApp, getScopedProgrammes, venueName } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  return (
    <AppShell>
      <title>Dashboard — VenueHub</title>
      <meta
        name="description"
        content="Overview of programmes, approvals, budgets and upcoming events."
      />
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const user = useApp((s) => s.user);
  const programmes = useApp((s) => s.programmes);
  const users = useApp((s) => s.users);
  const updateProgramme = useApp((s) => s.updateProgramme);
  const router = useRouter();
  if (!user) return null;

  const scoped = getScopedProgrammes(programmes, user, users);

  const total = scoped.length;
  const pending = scoped.filter(
    (p) => p.status === "submitted" || p.status === "union_approved",
  ).length;
  const approved = scoped.filter((p) => p.status === "teacher_approved").length;
  const rejected = scoped.filter((p) => p.status === "rejected").length;
  const completed = scoped.filter((p) => p.status === "completed").length;
  const budget = scoped.reduce(
    (a, p) => a + p.budget.reduce((acc, curr) => acc + curr.amount, 0),
    0,
  );

  const monthlyData = buildMonthly(scoped);
  const statusData = [
    { name: "Booked", value: approved, color: "var(--success)" },
    { name: "Pending", value: pending, color: "var(--warning)" },
    { name: "Rejected", value: rejected, color: "var(--destructive)" },
    {
      name: "Completed",
      value: completed,
      color: "var(--info)",
    },
  ].filter((d) => d.value > 0);

  const recent = [...scoped].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const upcoming = [...scoped]
    .filter(
      (p) =>
        new Date(p.date) >= new Date(new Date().toDateString()) &&
        !["submitted", "draft", "rejected", "completed"].includes(p.status),
    )
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const roleTitle: Record<string, string> = {
    wing: `Welcome, ${user.name.split(" ")[0]}`,
    union: user.union ? `${user.union} Union Dashboard` : "Union Dashboard",
    teacher: "Union Teacher Dashboard",
    principal: "Principal Dashboard",
    mic_manager: "Mic Permissions Dashboard",
    super_admin: "Super Admin Dashboard",
  };
  const roleSubtitle: Record<string, string> = {
    wing: "Track your wing's programmes and submit new requests.",
    union: "Review all programmes, approvals and venue usage across college.",
    teacher: "Final approvals and college-wide programme oversight.",
    principal: "Review and grant final permissions for events.",
    mic_manager: "Manage and approve microphone permissions.",
    super_admin: "System administration and overview.",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="order-1">
        <PageHeader
          title={roleTitle[user.role]}
          description={roleSubtitle[user.role]}
          action={
            user.role === "wing" ? (
              <Button asChild>
                <Link href="/programmes/new">
                  <CalendarPlus className="mr-2 h-4 w-4" /> Register Programme
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/calendar">
                  <CalendarDays className="mr-2 h-4 w-4" /> View Calendar
                </Link>
              </Button>
            )
          }
        />
      </div>

      {/* Stat cards */}
      <div className="order-2 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Programmes"
          value={total}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Pending"
          value={pending}
          tone="warning"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Approved"
          value={approved}
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completed}
          tone="info"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Budget"
          value={`₹${(budget / 1000).toFixed(0)}k`}
          tone="primary"
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="order-4 lg:order-3 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Monthly Programmes</h3>
              <p className="text-xs text-muted-foreground">Programmes registered per month</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Programme Status</h3>
          <p className="text-xs text-muted-foreground">Distribution of current statuses</p>
          <div className="mt-2 h-64">
            {statusData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {statusData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="order-3 lg:order-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-sm font-semibold">Recent Programmes</h3>
            <Link href="/programmes" className="text-xs font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Programme</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((p) => (
                <TableRow
                  key={p.id}
                  onClick={() => router.push(`/programmes/${p.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <span className="font-medium hover:underline text-primary">{p.name}</span>
                    <div className="text-xs text-muted-foreground">{p.wing}</div>
                  </TableCell>
                  <TableCell className="text-sm">{venueName(p.venueId)}</TableCell>
                  <TableCell className="text-sm">{format(new Date(p.date), "MMM d")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      {user.role === "union" && p.status === "booked" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProgramme(p.id, { status: "completed" });
                          }}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-5">
            <h3 className="text-sm font-semibold">Upcoming</h3>
            <p className="text-xs text-muted-foreground">Next scheduled programmes</p>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {upcoming.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No upcoming programmes.
              </div>
            )}
            {upcoming.map((p) => (
              <Link
                key={p.id}
                href={`/programmes/${p.id}`}
                className="flex items-start gap-3 p-4 hover:bg-muted/40"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(p.date), "MMM d")} · {p.startTime} · {venueName(p.venueId)}
                  </div>
                </div>
                <StatusBadge status={p.status} className="shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildMonthly(programmes: { date: string }[]) {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    map.set(format(dt, "MMM"), 0);
  }
  programmes.forEach((p) => {
    const label = format(new Date(p.date), "MMM");
    if (map.has(label)) map.set(label, (map.get(label) ?? 0) + 1);
  });
  return Array.from(map, ([month, count]) => ({ month, count }));
}
