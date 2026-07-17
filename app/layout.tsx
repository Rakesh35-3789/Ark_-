import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { ArkLoader } from "@/components/ArkLoader";

export const metadata: Metadata = {
  title: "ARK Chronicles",
  description: "India's Innovation Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ArkLoader />

        <AuthProvider>
          <Header />

          <main>{children}</main>

          <footer className="chronicles-footer">
            <div className="chronicles-footer-container">
              <div className="footer-brand">
                <h2>A.R.K</h2>
                <p>Architects of Rising Knowledge</p>
              </div>

              <div className="footer-links">
                <a href="/explore">Explore</a>
                <a href="/research">Research</a>
                <a href="/founders">Founders</a>
                <a href="/opportunities">Opportunities</a>
                <a href="/submit">Submit</a>
              </div>

              <div className="footer-bottom">
                © {new Date().getFullYear()} ARK Chronicles. All rights reserved.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}