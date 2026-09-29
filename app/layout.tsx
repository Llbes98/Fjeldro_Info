import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fjeldro Skiresort",
  description: "Information til gæster på Fjeldro Skiresort",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
