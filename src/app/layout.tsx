import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "ArtCloud Gallery - Manage Your Art Collection",
  description:
    "Professional gallery management system for artists, curators, and art enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body suppressHydrationWarning className={roboto.className}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
