import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/mock";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  useEffect(() => {
    router.navigate({ to: user ? "/dashboard" : "/login" });
  }, [user, router]);
  return null;
}
