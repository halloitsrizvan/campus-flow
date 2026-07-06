"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { useApp, venueName, CATEGORIES } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const programmes = useApp((s) => s.programmes);

  const venueUsage: Record<string, number> = {};
  programmes.forEach((p) => {
    const v = venueName(p.venueId);
    venueUsage[v] = (venueUsage[v] ?? 0) + 1;
  });
  const venueData = Object.entries(venueUsage).map(([name, count]) => ({ name, count }));

  const catUsage: Record<string, number> = {};
  CATEGORIES.forEach((c) => (catUsage[c] = 0));
  programmes.forEach((p) => (catUsage[p.category] = (catUsage[p.category] ?? 0) + 1));
  const catData = Object.entries(catUsage)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const budgetByCat: Record<string, number> = {};
  programmes.forEach((p) => (budgetByCat[p.category] = (budgetByCat[p.category] ?? 0) + p.budget));
  const budgetData = Object.entries(budgetByCat).map(([name, budget]) => ({ name, budget }));

  const approvalStats = [
    { label: "Booked", value: programmes.filter((p) => p.status === "teacher_approved").length },
    { label: "Rejected", value: programmes.filter((p) => p.status === "rejected").length },
    { label: "Completed", value: programmes.filter((p) => p.status === "completed").length },
    {
      label: "Pending",
      value: programmes.filter((p) => ["submitted", "union_approved"].includes(p.status)).length,
    },
  ];

  const colors = [
    "var(--primary)",
    "var(--success)",
    "var(--warning)",
    "var(--destructive)",
    "var(--info)",
    "oklch(0.6_0.15_320)",
    "oklch(0.68_0.16_45)",
  ];

  return (
    <AppShell>
      <title>Reports — VenueHub</title>
      <meta name="description" content="Programme, venue and budget reports." />
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Programme insights, venue usage and budget breakdown."
          action={
            <Button variant="outline" onClick={() => toast("PDF/Excel export coming soon")}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {approvalStats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ReportCard title="Venue Usage" subtitle="Number of programmes per venue">
            <ResponsiveContainer>
              <BarChart data={venueData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard title="Programme Categories" subtitle="Distribution across categories">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={catData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {catData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard
            title="Budget by Category"
            subtitle="Total budget (₹) per category"
            className="lg:col-span-2"
          >
            <ResponsiveContainer>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
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
                  formatter={(v: number) => `₹${v.toLocaleString()}`}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="budget" fill="var(--success)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
      </div>
    </AppShell>
  );
}

function ReportCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 shadow-sm ${className ?? ""}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}
