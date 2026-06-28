import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return <section className={`glass rounded-[6px] p-5 ${className}`}>{children}</section>;
}
