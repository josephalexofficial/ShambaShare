import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ShambaShare team about partnerships, demos, or cooperatives.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
