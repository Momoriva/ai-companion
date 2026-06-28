import Link from "next/link";
import { useRouter } from "next/router";

const tabs = [
  { href: "/", label: "Home", icon: "/assets/icons/navigation/home-seal.png" },
  { href: "/chat", label: "Chat", icon: "/assets/icons/navigation/chat-seal.png" },
  { href: "/moments", label: "Moments", icon: "/assets/icons/navigation/moments-seal.png" },
  { href: "/memory", label: "Memory", icon: "/assets/icons/navigation/memory-seal.png" },
  { href: "/profile", label: "Profile", icon: "/assets/icons/navigation/profile-seal.png" }
];

export function BottomNav() {
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] sm:max-w-2xl">
      <div className="bottom-nav-surface glass grid h-16 grid-cols-5 px-2">
        {tabs.map((tab) => {
          const active = router.pathname === tab.href;

          return (
            <Link
              aria-label={tab.label}
              className="flex min-w-0 items-center justify-center"
              href={tab.href}
              key={tab.href}
            >
              <span
                className={[
                  "nav-seal flex h-11 w-11 items-center justify-center transition",
                  active ? "nav-seal-active" : ""
                ].join(" ")}
              >
                <img alt="" aria-hidden="true" className="nav-seal-icon" src={tab.icon} />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
