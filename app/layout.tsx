import type { Metadata } from "next";
import { Open_Sans, Kumbh_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SANDWINA - Empowering Women to Get More Out of Work",
  description: "Affordable, approachable, and actionable career coaching for women. Connect with certified coaches to accelerate your career growth.",
  keywords: ["career coaching", "women empowerment", "professional development", "career advancement"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${kumbhSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
