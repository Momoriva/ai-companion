import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { CompanionAvatar } from "@/components/CompanionAvatar";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site-config";

export default function ProfilePage() {
  const [persona, setPersona] = useState(siteConfig.persona);

  useEffect(() => {
    const savedPersona = window.localStorage.getItem("ai-companion-persona");

    if (savedPersona) {
      setPersona(savedPersona);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ai-companion-persona", persona);
  }, [persona]);

  return (
    <AppLayout title="Profile">
      <PageHeader eyebrow="Profile" title={siteConfig.name} />
      <div className="space-y-4">
        <GlassCard className="ink-card--profile">
          <div className="flex items-center gap-4">
            <CompanionAvatar size={104} />
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold">{siteConfig.name}</h2>
              <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{siteConfig.bio}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="ink-card--form">
          <h2 className="text-lg font-semibold">Persona</h2>
          <textarea
            className="paper-input mt-4 min-h-44 w-full resize-none border border-[var(--color-border)] bg-white/80 px-4 py-3 text-[16px] leading-relaxed outline-none placeholder:text-[var(--color-muted)]"
            onChange={(event) => setPersona(event.target.value)}
            placeholder="写下 AI Companion 的 persona..."
            value={persona}
          />
        </GlassCard>

        <GlassCard className="ink-card--profile-note">
          <h2 className="text-lg font-semibold">世界观设定</h2>
          <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{siteConfig.worldview}</p>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
