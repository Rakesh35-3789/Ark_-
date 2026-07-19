import Link from "next/link";
import { LucideIcon } from "lucide-react";

type EmptySectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  submitLabel?: string;
};

export function EmptySectionPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  features,
  submitLabel = "Submit",
}: EmptySectionPageProps) {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        background: "#f8f7f3",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          width: "100%",
          background: "#fff",
          borderRadius: "18px",
          padding: "48px",
          boxShadow: "0 15px 40px rgba(0,0,0,.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={40} color="#233876" />
        </div>

        <p
          style={{
            color: "#233876",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            fontSize: "42px",
            margin: "12px 0",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#666",
            lineHeight: 1.8,
            marginBottom: "30px",
          }}
        >
          {description}
        </p>

        <ul
          style={{
            textAlign: "left",
            maxWidth: "420px",
            margin: "0 auto 35px",
            lineHeight: 2,
          }}
        >
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <Link
          href="/submit"
          style={{
            display: "inline-block",
            background: "#233876",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          {submitLabel}
        </Link>
      </div>
    </main>
  );
}