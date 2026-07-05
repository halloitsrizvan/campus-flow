import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp, type Role } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ShieldCheck, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — VenueHub" },
      { name: "description", content: "Sign in to VenueHub, the college venue booking and programme management platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const login = useApp((s) => s.login);
  const [role, setRole] = useState<Role>("wing");
  const [username, setUsername] = useState("rahul.m");
  const [password, setPassword] = useState("demo1234");

  useEffect(() => {
    if (user) router.navigate({ to: "/dashboard" });
  }, [user, router]);

  const roleOptions: { id: Role; label: string; icon: React.ComponentType<{ className?: string }>; blurb: string }[] = [
    { id: "wing", label: "Wing Member", icon: Users2, blurb: "Register & manage your wing's programmes." },
    { id: "union", label: "Union Member", icon: ShieldCheck, blurb: "Approve, monitor and manage venues." },
    { id: "teacher", label: "Teacher", icon: GraduationCap, blurb: "Final approval & oversight." },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,oklch(0.9_0.06_277/_0.6),transparent_50%),radial-gradient(circle_at_85%_90%,oklch(0.92_0.07_165/_0.55),transparent_45%)]"
      />
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:items-center">
        {/* Left: brand panel */}
        <div className="hidden flex-col justify-between lg:flex">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">V</div>
            <span className="text-lg font-semibold tracking-tight">VenueHub</span>
          </div>
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              One platform for every college programme.
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Book venues without conflicts, submit programme budgets, and track approvals from wing to
              faculty — all in one clean dashboard.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { k: "Live venue calendar" },
                { k: "Multi-step approvals" },
                { k: "Budget visibility" },
              ].map((f) => (
                <div key={f.k} className="rounded-lg border bg-card/60 p-3 text-xs text-muted-foreground backdrop-blur">
                  {f.k}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} VenueHub. College use only.</p>
        </div>

        {/* Right: form */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
            <div className="lg:hidden mb-6 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">V</div>
              <span className="text-lg font-semibold tracking-tight">VenueHub</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                login(username, role);
                router.navigate({ to: "/dashboard" });
              }}
            >
              <div className="space-y-1.5">
                <Label>Sign in as</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((o) => {
                    const Icon = o.icon;
                    const active = role === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setRole(o.id)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted/60",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                <p className="pt-1 text-xs text-muted-foreground">
                  {roleOptions.find((o) => o.id === role)?.blurb}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">Sign in</Button>

              <p className="pt-2 text-center text-xs text-muted-foreground">
                Accounts are provisioned by the Union / Admin. Contact them to create one.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
