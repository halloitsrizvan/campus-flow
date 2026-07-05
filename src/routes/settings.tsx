import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useApp } from "@/lib/mock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VenueHub" },
      { name: "description", content: "Profile and notification preferences." },
    ],
  }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

function SettingsPage() {
  const user = useApp((s) => s.user);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your profile and preferences." />

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.role} · @{user.username}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Full name</Label>
            <Input defaultValue={user.name} />
          </div>
          <div className="grid gap-1.5">
            <Label>Username</Label>
            <Input defaultValue={user.username} disabled />
          </div>
          {user.wing && (
            <div className="grid gap-1.5 sm:col-span-2">
              <Label>Wing</Label>
              <Input defaultValue={user.wing} disabled />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold">Notification preferences</h3>
        <div className="mt-4 space-y-4">
          {[
            { label: "Programme submitted", d: "Notify me when a new programme is submitted." },
            { label: "Approvals & rejections", d: "Notify me when a status changes." },
            { label: "Comments", d: "Notify me when someone comments on my programmes." },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.d}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
