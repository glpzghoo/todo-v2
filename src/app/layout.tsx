import type { Metadata } from "next";
import {
  Charm,
  Charmonman,
  Cookie,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Lobster,
  Lugrasimo,
  LXGW_WenKai_TC,
  Marck_Script,
  Montserrat,
  Yanone_Kaffeesatz,
} from "next/font/google";
import "./globals.css";
import { ApolloClientProvide } from "@/lib/apolloclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODOOOOOOOO",
  description: "yes todo",
};
const montserrate = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: "400",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrate.className} antialiased`}
      >
        <ApolloClientProvide>{children}</ApolloClientProvide>
      </body>
    </html>
  );
}
