import { CalendarDays, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { AppLayout } from "@/components/AppLayout";
import { CompanionAvatar } from "@/components/CompanionAvatar";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { formatDate, getTogetherDays } from "@/lib/dates";
import { getMoments } from "@/lib/server-data";
import { siteConfig } from "@/lib/site-config";
import type { Moment } from "@/types/site";

type HomePageProps = {
  moments: Moment[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const moments = await getMoments();
  return { props: { moments: moments.slice(0, 2) } };
};

export default function HomePage({ moments }: HomePageProps) {
  const togetherDays = getTogetherDays(siteConfig.anniversary);
  const dailyMessage = siteConfig.dailyMessages[0] ?? siteConfig.welcome;

  return (
    <AppLayout title="Home">
      <PageHeader eyebrow={siteConfig.welcome} title={siteConfig.name} />

      <div className="space-y-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <CompanionAvatar />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-muted)]">{siteConfig.tagline}</p>
              <h2 className="mt-1 truncate text-2xl font-semibold">{siteConfig.name}</h2>
              <div className="mt-3 inline-flex rounded-full bg-[var(--color-secondary)] px-3 py-1 text-sm font-medium">
                Together Days · {togetherDays}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-[var(--color-surface-strong)]">
          <p className="text-sm font-medium text-[var(--color-muted)]">今日寄语</p>
          <p className="mt-3 text-xl font-semibold leading-relaxed">{dailyMessage}</p>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
              <CalendarDays size={19} />
            </span>
            <p className="mt-3 text-sm text-[var(--color-muted)]">开始日期</p>
            <p className="mt-1 text-lg font-semibold">{formatDate(siteConfig.anniversary)}</p>
          </GlassCard>

          <Link href="/chat" className="glass flex rounded-[32px] p-4">
            <div className="flex w-full flex-col justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <MessageCircle size={19} />
              </span>
              <div>
                <p className="mt-3 text-sm text-[var(--color-muted)]">继续聊天</p>
                <p className="mt-1 text-lg font-semibold">Open Chat</p>
              </div>
            </div>
          </Link>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">最近动态</h2>
            <Link className="text-sm font-medium text-[var(--color-muted)]" href="/moments">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {moments.map((moment) => (
              <GlassCard className="p-4" key={moment.id}>
                <p className="leading-relaxed">{moment.content}</p>
                <p className="mt-3 text-sm text-[var(--color-muted)]">{formatDate(moment.created_at)}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
