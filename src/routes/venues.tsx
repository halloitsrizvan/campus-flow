import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp, type Venue } from "@/lib/mock";
import { Ban, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/venues")({
  head: () => ({
    meta: [
      { title: "Venues — VenueHub" },
      { name: "description", content: "Manage venues available for programme bookings." },
    ],
  }),
  component: () => (
    <AppShell>
      <VenuesPage />
    </AppShell>
  ),
});

function VenuesPage() {
  const user = useApp((s) => s.user);
  const venues = useApp((s) => s.venues);
  const addVenue = useApp((s) => s.addVenue);
  const updateVenue = useApp((s) => s.updateVenue);
  const removeVenue = useApp((s) => s.removeVenue);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Venue | null>(null);
  const [form, setForm] = useState({ name: "", capacity: 100, location: "" });

  if (!user) return null;

  function openNew() {
    setEditing(null);
    setForm({ name: "", capacity: 100, location: "" });
    setOpen(true);
  }
  function openEdit(v: Venue) {
    setEditing(v);
    setForm({ name: v.name, capacity: v.capacity, location: v.location });
    setOpen(true);
  }
  function save() {
    if (!form.name) return;
    if (editing) {
      updateVenue(editing.id, { ...form });
      toast.success("Venue updated");
    } else {
      addVenue({ id: `v${Date.now()}`, active: true, ...form });
      toast.success("Venue added");
    }
    setOpen(false);
  }

  const canEdit = user.role === "union";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Venues"
        description="Add, edit, block or delete venues used for programme bookings."
        action={
          canEdit && (
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Venue
            </Button>
          )
        }
      />

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venue</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              {canEdit && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{v.location}</TableCell>
                <TableCell>{v.capacity}</TableCell>
                <TableCell>
                  {v.blocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                      <Ban className="h-3 w-3" /> Blocked
                    </span>
                  ) : v.active ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Inactive</span>
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          updateVenue(v.id, { blocked: !v.blocked });
                          toast(v.blocked ? "Venue unblocked" : "Venue blocked");
                        }}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeVenue(v.id);
                          toast.success("Venue deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Venue" : "Add Venue"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>Capacity</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
