import { Heart, Home, MessageCircle, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/moments", label: "Moments", icon: Sparkles },
  { href: "/memory", label: "Memory", icon: Heart },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function BottomNav() {
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] sm:max-w-2xl">
      <div className="glass grid h-16 grid-cols-5 rounded-[28px] px-2">
        {tabs.map((tab) => {
          const active = router.pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              aria-label={tab.label}
              className="flex min-w-0 items-center justify-center"
              href={tab.href}
              key={tab.href}
            >
              <span
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-full transition",
                  active ? "bg-[var(--color-primary)] text-white shadow-card" : "text-[var(--color-muted)]"
                ].join(" ")}
              >
                <Icon size={21} strokeWidth={2.2} />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
