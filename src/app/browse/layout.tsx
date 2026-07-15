import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find tools",
  description:
    "Browse nearest climate-smart farm equipment around Eldoret and Uasin Gishu.",
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
