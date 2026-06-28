import { siteConfig } from "@/lib/site-config";

type CompanionAvatarProps = {
  size?: number;
};

export function CompanionAvatar({ size = 92 }: CompanionAvatarProps) {
  return (
    <div
      className="companion-avatar relative shrink-0 overflow-hidden rounded-[6px] border border-white/70 bg-[var(--color-secondary)] shadow-card"
      style={{ height: size, width: size }}
    >
      <img alt={siteConfig.name} className="h-full w-full object-cover" src={siteConfig.avatar} />
    </div>
  );
}
