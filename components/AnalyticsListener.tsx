"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/firebase";

export default function AnalyticsListener() {
  useEffect(() => {
    // This component purely ensures that the analytics import in @/lib/firebase
    // is executed in a client context, triggering the logic there.
    // In a more complex setup, we might manually log a page_view event here,
    // but the default Firebase Analytics setup tracks page_views automatically
    // coupled with the history API of the browser if configured in the console.
    // However, explicitly logging 'app_open' or similar custom events can happen here.
    if (analytics) {
      // Analytics initialized
    }
  }, []);

  return null;
}
