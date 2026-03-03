import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineSync - 映画スケジュール比較",
  description: "関東圏の映画館スケジュールを横断比較。デートプランを簡単に共有。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
