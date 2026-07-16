"use client";

import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useApp, type Role, type User } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShieldAlert,
  Trash2,
  Edit2,
  PlusCircle,
  ShieldCheck,
  GraduationCap,
  Users2,
  Settings2,
} from "lucide-react";
import { useRouter } from "next/navigation";

function roleLabel(role: Role) {
  switch (role) {
    case "super_admin":
      return {
        label: "Super Admin",
        icon: Settings2,
        cls: "bg-destructive/10 text-destructive border-destructive/30",
      };
    case "teacher":
      return {
        label: "Teacher",
        icon: GraduationCap,
        cls: "bg-success/15 text-success border-success/30",
      };
    case "union":
      return {
        label: "Union Admin",
        icon: ShieldCheck,
        cls: "bg-primary/10 text-primary border-primary/30",
      };
    case "wing":
      return { label: "Wing Admin", icon: Users2, cls: "bg-info/10 text-info border-info/30" };
  }
}

export default function UsersPage() {
  const user = useApp((s) => s.user);
  const router = useRouter();

  if (!user) return null;

  if (user.role !== "super_admin") {
    return (
      <AppShell>
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <ShieldAlert className="h-12 w-12 text-destructive/80 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-6" variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <title>Manage Users — VenueHub</title>
      <meta name="description" content="Manage system users and access roles." />
      <UsersContent />
    </AppShell>
  );
}

function UsersContent() {
  const users = useApp((s) => s.users);
  const removeUser = useApp((s) => s.removeUser);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredUsers = users.filter((u) => activeTab === "all" || u.role === activeTab);

  const handleDelete = async (id: string) => {
    try {
      await removeUser(id);
      toast.success("User deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-start justify-between">
        <PageHeader
          title="User Management"
          description="Create, update, and remove users from the platform."
        />
        <UserFormModal mode="create" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="wing">Wing Admins</TabsTrigger>
          <TabsTrigger value="union">Union Admins</TabsTrigger>
          <TabsTrigger value="teacher">Teachers</TabsTrigger>
        </TabsList>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wing Info</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found for this role.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => {
                  const meta = roleLabel(u.role);
                  const Icon = meta.icon;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={meta.cls}>
                          <Icon className="mr-1.5 h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.wing || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <UserFormModal mode="edit" user={u} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteId(u.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserFormModal({ mode, user }: { mode: "create" | "edit"; user?: User }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const addUser = useApp((s) => s.addUser);
  const updateUser = useApp((s) => s.updateUser);

  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    username: user?.username || "",
    role: user?.role || "wing",
    wing: user?.wing || "",
    union: user?.union || "Lisan",
  });
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalName = formData.name;
      if (formData.role === "wing") finalName = formData.wing || "Wing Admin";
      if (formData.role === "union") finalName = "Union Admin";

      const payload = { ...formData, name: finalName };

      if (mode === "create") {
        await addUser({ ...payload, password } as unknown as User);
        toast.success("User created successfully.");
      } else {
        await updateUser(user!.id, { ...payload, ...(password ? { password } : {}) });
        toast.success("User updated successfully.");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${mode} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add User
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new user to the platform. They will be able to log in immediately."
              : "Update user details. Leave password blank to keep current."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {formData.role !== "wing" && formData.role !== "union" && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. John Doe"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                placeholder="john.doe"
                disabled={mode === "edit" && user?.role === "super_admin"}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode === "create"}
                placeholder={mode === "edit" ? "Leave blank to keep" : "••••••••"}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val: Role) => setFormData({ ...formData, role: val })}
              disabled={mode === "edit" && user?.role === "super_admin"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wing">Wing Admin</SelectItem>
                <SelectItem value="union">Union Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.role === "wing" && (
            <div className="space-y-2">
              <Label>Wing Name</Label>
              <Input
                value={formData.wing}
                onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                placeholder="e.g. Computer Science Wing"
                required
              />
            </div>
          )}
          {formData.role !== "super_admin" && (
            <div className="space-y-2">
              <Label>Union</Label>
              <Select
                value={formData.union}
                onValueChange={(val) => setFormData({ ...formData, union: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Union" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lisan">Lisan</SelectItem>
                  <SelectItem value="DSU">DSU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
