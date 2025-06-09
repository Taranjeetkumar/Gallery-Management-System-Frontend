"use client";

import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
const clientSideEmotionCache = createEmotionCache();

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ReduxProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}
