"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/mock";

export default function DbProvider({ children }: { children: React.ReactNode }) {
  const fetchInitialData = useApp((s) => s.fetchInitialData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("DbProvider: fetchInitialData starting...");
    fetchInitialData()
      .then(() => {
        console.log("DbProvider: fetchInitialData resolved successfully!");
      })
      .catch((err) => {
        console.error("DbProvider: fetchInitialData rejected:", err);
      })
      .finally(() => {
        console.log("DbProvider: fetchInitialData completed, setting loaded to true");
        setLoaded(true);
      });
  }, [fetchInitialData]);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/10" />
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">VenueHub</h2>
            <p className="mt-1 text-xs text-muted-foreground animate-pulse">
              Syncing with database...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
