import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

type CompanionAvatarProps = {
  size?: number;
};

export function CompanionAvatar({ size = 92 }: CompanionAvatarProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[32px] border border-white/70 bg-[var(--color-secondary)] shadow-card"
      style={{ height: size, width: size }}
    >
      <Image src={siteConfig.avatar} alt={siteConfig.name} fill className="object-cover" priority />
    </div>
  );
}
