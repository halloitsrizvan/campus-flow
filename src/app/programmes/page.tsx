"use client";

import Link from "next/link";
import { AppShell, PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  useApp,
  venueName,
  CATEGORIES,
  type ProgrammeStatus,
  statusMeta,
  getScopedProgrammes,
} from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarPlus, ClipboardList, Search, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES: { id: ProgrammeStatus | "all"; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "union_approved", label: "Union Approved" },
  { id: "teacher_approved", label: "Booked" },
  { id: "rejected", label: "Rejected" },
  { id: "completed", label: "Completed" },
];

export default function ProgrammesPage() {
  const user = useApp((s) => s.user);
  const programmes = useApp((s) => s.programmes);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [manageModal, setManageModal] = useState<{
    type: "edit" | "delete";
    programmeId: string;
  } | null>(null);
  const removeProgramme = useApp((s) => s.removeProgramme);
  const updateProgramme = useApp((s) => s.updateProgramme);
  const perPage = 8;
  const users = useApp((s) => s.users);

  const scoped = useMemo(() => {
    return getScopedProgrammes(programmes, user, users);
  }, [user, programmes, users]);

  const filtered = useMemo(() => {
    return scoped.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && !p.category.includes(category)) return false;
      if (
        q &&
        !`${p.name} ${p.wing} ${p.category.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [scoped, q, status, category]);

  if (!user) return null;

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  return (
    <AppShell>
      <title>Programmes — VenueHub</title>
      <meta name="description" content="Browse, filter and manage college programmes." />
      <div className="space-y-6">
        <PageHeader
          title={user.role === "wing" ? "My Programmes" : "All Programmes"}
          description="Search, filter and open programme details."
          action={
            user.role === "wing" && (
              <Button asChild>
                <Link href="/programmes/new">
                  <CalendarPlus className="mr-2 h-4 w-4" /> Register Programme
                </Link>
              </Button>
            )
          }
        />

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="grid gap-3 border-b p-4 sm:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
                placeholder="Search programme, wing…"
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<ClipboardList className="h-7 w-7" />}
                title="No programmes match"
                description="Try clearing filters, or register a new programme."
                action={
                  user.role === "wing"
                    ? { label: "Register Programme", onClick: () => router.push("/programmes/new") }
                    : undefined
                }
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Programme</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    {user.role === "super_admin" && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/programmes/${p.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.wing}</div>
                      </TableCell>
                      <TableCell className="text-sm">{p.category.join(", ")}</TableCell>
                      <TableCell className="text-sm">{venueName(p.venueId)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(p.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹{p.budget.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      {user.role === "super_admin" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                setManageModal({ type: "edit", programmeId: p.id });
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setManageModal({ type: "delete", programmeId: p.id });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
                <span>
                  Showing {rows.length} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <span>
                    Page {page + 1} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page + 1 >= pageCount}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog
        open={manageModal?.type === "delete"}
        onOpenChange={(o) => !o && setManageModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Programme</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this programme? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageModal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (manageModal?.programmeId) {
                  try {
                    await removeProgramme(manageModal.programmeId);
                    toast.success("Programme deleted");
                  } catch (err) {
                    toast.error("Failed to delete programme");
                  } finally {
                    setManageModal(null);
                  }
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manageModal?.type === "edit"} onOpenChange={(o) => !o && setManageModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Status</DialogTitle>
            <DialogDescription>
              As a Super Admin, you can manually override the status of this programme.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={programmes.find((p) => p.id === manageModal?.programmeId)?.status}
              onValueChange={async (val) => {
                if (manageModal?.programmeId) {
                  try {
                    await updateProgramme(manageModal.programmeId, {
                      status: val as ProgrammeStatus,
                    });
                    toast.success("Status updated");
                    setManageModal(null);
                  } catch (err) {
                    toast.error("Failed to update status");
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.filter((s) => s.id !== "all").map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
