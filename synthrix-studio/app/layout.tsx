import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTHRIX Studio — Independent Game Studio · Bangladesh",
  description:
    "Meet SYNTHRIX Studio — Bangladesh's independent game development team. Explore our full team roster, upcoming flagship Rhino's Last Protocol, dev news, and join our team.",
  keywords:
    "SYNTHRIX Studio, indie game studio Bangladesh, free PC games download, Suvom Kundu game developer",
  openGraph: {
    title: "SYNTHRIX Studio",
    description:
      "Independent game studio from Bangladesh. Download free PC games: Escape the Bridge, BOOM, OVERDRIVE, SYNTHPAD.",
    url: "https://synthrix-website.vercel.app",
    siteName: "SYNTHRIX Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="RytHY9Movd2aQu6KpXRerON__jX4gtjqoaGAbHWcZYQ" />
      </head>
      <body>{children}</body>
    </html>
  );
}
