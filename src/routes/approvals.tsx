import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { useApp, venueName } from "@/lib/mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals — VenueHub" },
      { name: "description", content: "Review and act on pending programme approvals." },
    ],
  }),
  component: () => (
    <AppShell>
      <ApprovalsPage />
    </AppShell>
  ),
});

function ApprovalsPage() {
  const user = useApp((s) => s.user);
  const programmes = useApp((s) => s.programmes);
  const navigate = useNavigate();

  if (!user) return null;

  const pending = programmes.filter((p) =>
    user.role === "union" ? p.status === "submitted" : p.status === "union_approved",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Approvals"
        description={
          user.role === "union"
            ? "Programmes submitted by wings waiting for Union review."
            : "Programmes cleared by Union waiting for final faculty approval."
        }
      />

      {pending.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-7 w-7" />}
          title="No pending approvals"
          description="You're all caught up. New submissions will appear here."
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Programme</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate({ to: "/programmes/$id", params: { id: p.id } })}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm">{p.wing}</TableCell>
                  <TableCell className="text-sm">{format(new Date(p.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-sm">{venueName(p.venueId)}</TableCell>
                  <TableCell className="text-sm">₹{p.budget.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
