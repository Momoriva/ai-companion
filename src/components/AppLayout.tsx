import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { siteConfig } from "@/lib/site-config";
import { themeStyle } from "@/lib/theme";

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function AppLayout({ children, title }: AppLayoutProps) {
  const router = useRouter();
  const pageTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.name;

  return (
    <div style={themeStyle()} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={siteConfig.bio} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <main className="safe-bottom mx-auto min-h-screen w-full max-w-[430px] px-4 pt-5 sm:max-w-2xl sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
