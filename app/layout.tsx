import type { Metadata } from "next";
import { Source_Code_Pro, Noto_Sans, Courier_Prime } from "next/font/google";
import Script from "next/script";
import { CursorToggle } from "./components/cursor-toggle";
import { siteConfig, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
});

const DESCRIPTION =
  "Meet Chauhan is a Full Stack Developer building scalable web applications with React, Next.js, TypeScript and Node.js. See his projects, experience and contact details.";

export const metadata: Metadata = {
  // Lets Next resolve every relative URL below against the real domain.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Meet Chauhan — Full Stack Developer",
    // Sub-pages get "<page> · Meet Chauhan" so his name is in every title.
    template: "%s · Meet Chauhan",
  },
  description: DESCRIPTION,
  applicationName: "Meet Chauhan — Portfolio",
  authors: [{ name: siteConfig.fullName, url: SITE_URL }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  keywords: [
    "Meet Chauhan",
    "Meet Chauhan portfolio",
    "Meet Chauhan developer",
    "Meet Chauhan Full Stack Developer",
    "full stack developer",
    "React developer",
    "Next.js developer",
    "TypeScript",
    "Node.js",
    "web developer portfolio",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Meet Chauhan",
    title: "Meet Chauhan — Full Stack Developer",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Meet Chauhan — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Chauhan — Full Stack Developer",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  // Paste the token from Search Console → Verification → HTML tag.
  // verification: { google: "your-token-here" },
};

/**
 * Structured data. This is the part that helps a search for "Meet Chauhan"
 * resolve to *this* Meet Chauhan: `sameAs` ties the site to profiles Google
 * already trusts, so it can treat them as one entity rather than several
 * unrelated pages that happen to share a name.
 */
function StructuredData() {
  const profiles = [siteConfig.links.github, siteConfig.links.linkedin].filter(
    (url): url is string => Boolean(url) && url !== "#"
  );

  const graph = [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: siteConfig.fullName,
      url: SITE_URL,
      image: `${SITE_URL}${siteConfig.photo}`,
      jobTitle: "Full Stack Developer",
      email: `mailto:${siteConfig.links.email}`,
      description: DESCRIPTION,
      sameAs: profiles,
      knowsAbout: [
        "Full Stack Development",
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "MongoDB",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Meet Chauhan — Portfolio",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored JSON — no user input reaches this.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sourceCodePro.variable} ${notoSans.variable} ${courierPrime.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();`,
          }}
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=psychiatry,sunny" />
        <link rel="preload" href="/mac-folder-back-opt.svg" as="image" />
        <link rel="preload" href="/mac-folder-front-opt.svg" as="image" />
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* CursorKit — visitors can try any cursor style live on this page.
            Loaded lazily so it never blocks the portfolio's own render. */}
        <Script
          src="https://cursor-kit-one.vercel.app/dashboard.js?persist=1&position=bottom-right"
          strategy="lazyOnload"
        />
        <CursorToggle />
      </body>
    </html>
  );
}
