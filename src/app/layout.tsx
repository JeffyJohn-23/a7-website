// Server Component — no "use client" so Next.js can SSR above-the-fold content
import type { Metadata } from "next";
import { ClientShell } from "@/components/ui/ClientShell";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.a7entertainment.in"),
  title: {
    default: "A7 Entertainment | Event Management & Digital Marketing Agency",
    template: "%s | A7 Entertainment",
  },
  description:
    "A7 Entertainment is a premium event management and digital marketing agency in India. We specialize in celebrity management, brand launches, film promotions, corporate events, and influencer marketing.",
  keywords: [
    "event management company India",
    "event management agency Kerala",
    "celebrity management India",
    "brand activation agency",
    "film promotions India",
    "influencer marketing agency",
    "corporate event management",
    "digital marketing agency India",
    "wedding entertainment India",
    "stage show production",
    "event planner India",
    "A7 Entertainment",
  ],
  openGraph: {
    type: "website",
    url: "https://www.a7entertainment.in",
    siteName: "A7 Entertainment",
    title: "A7 Entertainment | Event Management & Digital Marketing Agency",
    description:
      "Premium event management and digital marketing agency. Celebrity management, brand launches, film promotions, and more.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "A7 Entertainment — Event Management & Digital Marketing Agency",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "A7 Entertainment | Event Management & Digital Marketing Agency",
    description:
      "Premium event management and digital marketing agency in India.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.a7entertainment.in" },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "LocalBusiness"],
                  "@id": "https://www.a7entertainment.in/#organization",
                  name: "A7 Entertainment",
                  url: "https://www.a7entertainment.in",
                  logo: "https://www.a7entertainment.in/logo-white.png",
                  description:
                    "A7 Entertainment is a premium event management and digital marketing agency in India, specializing in celebrity management, brand launches, film promotions, corporate events, and influencer marketing.",
                  foundingDate: "2016",
                  telephone: "+919886112547",
                  email: "enquiry@a7entertainment.in",
                  sameAs: [
                    "https://www.instagram.com/a7entertainment/",
                    "https://www.linkedin.com/company/a7entertainment",
                  ],
                  areaServed: ["India", "Kerala", "UAE"],
                  serviceType: [
                    "Event Management",
                    "Celebrity Management",
                    "Brand Activation",
                    "Film Promotions",
                    "Influencer Marketing",
                    "Digital Marketing",
                    "Corporate Events",
                    "Wedding Entertainment",
                    "Stage Show Production",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.a7entertainment.in/#website",
                  url: "https://www.a7entertainment.in",
                  name: "A7 Entertainment",
                  publisher: {
                    "@id": "https://www.a7entertainment.in/#organization",
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://www.a7entertainment.in/#faq",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "What types of events does A7 Entertainment manage?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We manage the full spectrum — from large-scale concerts and film promotions to corporate conferences, brand activations, wedding entertainment, and cultural festivals.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Do you manage celebrity bookings for events?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Our celebrity management arm handles talent identification, negotiations, logistics, and on-ground coordination for both national and international artists.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Which cities and regions do you operate in?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We operate pan-India with a strong presence in Kerala, and have delivered international productions in Dubai, UAE.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How do I get a quote for my event?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Reach out through our contact form or WhatsApp us directly at +919886112547. We'll schedule a consultation to understand your vision and provide a detailed proposal.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Do you offer digital marketing alongside event management?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Our digital marketing division runs performance marketing, social media, influencer campaigns, and content production — often integrated with live events for maximum reach.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What is A7 Studio?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "A7 Studio is our in-house content production facility offering professional shoot spaces, podcast setups, and post-production support for brands and creators.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What makes A7 Entertainment different from other event management companies?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "A7 Entertainment is a fully integrated agency — event production, celebrity management, digital marketing, influencer campaigns, and content creation all live under one roof. This integration means faster execution, tighter brand consistency, and measurable ROI across every touchpoint of your campaign.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Can you handle brand activations for corporate clients in Kerala?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Absolutely. Brand activations are one of our core specialities — from experiential pop-ups and product launch events to interactive installations and sponsored experiences. We have delivered brand activation campaigns for businesses across Kerala and pan-India.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
        {/* Lenis + CustomCursor are client-only; wrapped so layout stays a Server Component */}
        <ClientShell>
          {children}
        </ClientShell>
        {/* Vercel Analytics (client) — placed after children per App Router guidance */}
        <Analytics />
      </body>
    </html>
  );
}
