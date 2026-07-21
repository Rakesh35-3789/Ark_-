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
      <body className="ark-loading" suppressHydrationWarning>
        <style>{`
          html,
          body {
            margin: 0;
            background: #f2efe6;
          }

          body.ark-loading {
            overflow: hidden;
          }

          body.ark-loading
            > *:not(.ark-opening-loader):not(style):not(script) {
            visibility: hidden;
          }

          .ark-opening-loader {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: grid;
            place-items: center;
            overflow: hidden;
            background: #f2efe6;
            color: #101010;
            isolation: isolate;
          }
        `}</style>

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