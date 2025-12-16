import { Playground } from "@/components/playground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground - JavaScript & TypeScript REPL",
  description:
    "Write, run, and test JavaScript and TypeScript code in real-time. Interactive code playground with syntax highlighting, auto-run, and customizable themes.",
  keywords: [
    "javascript playground",
    "typescript playground",
    "online code editor",
    "javascript repl",
    "typescript repl",
    "code runner",
    "live coding",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <Playground />;
}
