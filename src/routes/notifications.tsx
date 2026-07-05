import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { useApp } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — VenueHub" },
      { name: "description", content: "All notifications and activity updates." },
    ],
  }),
  component: () => (
    <AppShell>
      <NotificationsPage />
    </AppShell>
  ),
});

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

const TONES = {
  info: "bg-info/10 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

function NotificationsPage() {
  const notifications = useApp((s) => s.notifications);
  const markAllRead = useApp((s) => s.markAllNotificationsRead);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Everything happening across your programmes."
        action={<Button variant="outline" onClick={markAllRead}>Mark all read</Button>}
      />

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-7 w-7" />} title="No notifications" description="You'll see updates on submissions, approvals and comments here." />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm divide-y">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <div key={n.id} className={cn("flex items-start gap-4 p-4", !n.read && "bg-primary/5")}>
                <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", TONES[n.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{n.title}</div>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.at), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
