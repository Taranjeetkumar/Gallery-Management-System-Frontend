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
  title: "GalleryPro - Manage Your Art Collection",
  description: "Complete gallery management solution for artists, artworks, contacts, staff, and events",
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
