// Server Component — no "use client" so Next.js can SSR above-the-fold content
import { ClientShell } from "@/components/ui/ClientShell";
import "@/styles/globals.css";

export const metadata = {
  title: "A7 Entertainment",
  description: "Creating experiences that move people",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preconnect to Google Fonts origin for faster font fetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* display=swap prevents fonts from blocking FCP */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        {/* Lenis + CustomCursor are client-only; wrapped so layout stays a Server Component */}
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
