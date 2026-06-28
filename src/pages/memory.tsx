import { Archive, CalendarDays, Pin, Plus, RotateCcw, Search } from "lucide-react";
import type { GetServerSideProps } from "next";
import { FormEvent, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/dates";
import { getMemories } from "@/lib/server-data";
import type { Memory } from "@/types/site";

type MemoryPageProps = {
  initialMemories: Memory[];
};

type StatusFilter = "active" | "archived";
type SourceFilter = "all" | "diary" | "other";

export const getServerSideProps: GetServerSideProps<MemoryPageProps> = async () => {
  return { props: { initialMemories: await getMemories() } };
};

export default function MemoryPage({ initialMemories }: MemoryPageProps) {
  const [memories, setMemories] = useState(initialMemories);
  const [status, setStatus] = useState<StatusFilter>("active");
  const [source, setSource] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [importance, setImportance] = useState(6);
  const [isSaving, setIsSaving] = useState(false);

  const filteredMemories = useMemo(() => {
    return memories
      .filter((memory) => (status === "active" ? memory.is_active : !memory.is_active))
      .filter((memory) => {
        if (source === "diary") {
          return memory.source.startsWith("old-diary:");
        }

        if (source === "other") {
          return !memory.source.startsWith("old-diary:");
        }

        return true;
      })
      .filter((memory) => {
        const query = search.trim().toLowerCase();

        if (!query) {
          return true;
        }

        return [memory.title, memory.description, memory.source, memory.author ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || b.importance - a.importance);
  }, [memories, search, source, status]);

  async function handleAddMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: draft,
          importance,
          source: "manual",
          author: "user",
          room: "default"
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMemories((current) => [data.memory, ...current]);
      setDraft("");
      setImportance(6);
    } catch {
      const fallback: Memory = {
        id: crypto.randomUUID(),
        title: draft.slice(0, 28) || "新记忆",
        description: draft,
        happened_at: new Date().toISOString(),
        type: "memory",
        valence: 0,
        arousal: 0.35,
        importance,
        is_pinned: false,
        is_resolved: false,
        is_active: true,
        source: "manual",
        author: "local",
        activation_count: 0,
        last_activated_at: null,
        room: "default"
      };

      setMemories((current) => [fallback, ...current]);
      setDraft("");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleArchive(memory: Memory) {
    setMemories((current) =>
      current.map((item) => (item.id === memory.id ? { ...item, is_active: !item.is_active } : item))
    );

    if (memory.id.startsWith("fallback-")) {
      return;
    }

    await fetch("/api/memories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...memory, is_active: !memory.is_active })
    });
  }

  async function togglePin(memory: Memory) {
    setMemories((current) =>
      current.map((item) => (item.id === memory.id ? { ...item, is_pinned: !item.is_pinned } : item))
    );

    if (memory.id.startsWith("fallback-")) {
      return;
    }

    await fetch("/api/memories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...memory, is_pinned: !memory.is_pinned })
    });
  }

  return (
    <AppLayout title="Memory">
      <PageHeader eyebrow="Memory System" title="记忆管理" />

      <div className="space-y-4">
        <GlassCard className="p-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              className={tabClass(status === "active")}
              onClick={() => setStatus("active")}
              type="button"
            >
              活跃
            </button>
            <button
              className={tabClass(status === "archived")}
              onClick={() => setStatus("archived")}
              type="button"
            >
              已归档
            </button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["all", "diary", "other"] as SourceFilter[]).map((item) => (
              <button className={tabClass(source === item)} key={item} onClick={() => setSource(item)} type="button">
                {item === "all" ? "全部" : item === "diary" ? "日记" : "其他"}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="search-field glass flex items-center gap-2 px-4 py-3">
          <Search size={18} className="text-[var(--color-muted)]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--color-muted)]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索正文、来源、作者"
            value={search}
          />
        </div>

        <GlassCard>
          <form className="space-y-4" onSubmit={handleAddMemory}>
            <textarea
              className="paper-input min-h-28 w-full resize-none border border-[var(--color-border)] bg-white/80 px-4 py-3 text-[16px] outline-none placeholder:text-[var(--color-muted)]"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="手动添加一条结构化记忆..."
              value={draft}
            />
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-[var(--color-muted)]">
                <span>重要度</span>
                <span>{importance}/10</span>
              </div>
              <input
                className="w-full accent-[var(--color-primary)]"
                max={10}
                min={1}
                onChange={(event) => setImportance(Number(event.target.value))}
                type="range"
                value={importance}
              />
            </div>
            <button
              className="primary-action flex h-12 w-full items-center justify-center gap-2 bg-[var(--color-primary)] font-semibold text-white shadow-card disabled:opacity-50"
              disabled={isSaving || !draft.trim()}
              type="submit"
            >
              <Plus size={19} />
              添加记忆
            </button>
          </form>
        </GlassCard>

        <div className="space-y-3">
          {filteredMemories.map((memory) => (
            <GlassCard className="p-4" key={memory.id}>
              <div className="flex gap-4">
                <span className="small-mark flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-secondary)] text-[var(--color-text)]">
                  <CalendarDays size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-muted)]">{formatDate(memory.happened_at)}</p>
                      <h2 className="mt-1 truncate text-lg font-semibold">{memory.title}</h2>
                    </div>
                    <span className="status-chip shrink-0 px-3 py-1 text-sm font-semibold">
                      {memory.importance}
                    </span>
                  </div>

                  <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{memory.description}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-[var(--color-muted)]">
                    <Metric label="V" value={memory.valence.toFixed(2)} />
                    <Metric label="A" value={memory.arousal.toFixed(2)} />
                    <Metric label="Hit" value={String(memory.activation_count)} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="status-chip bg-white/80 px-3 py-1 text-xs text-[var(--color-muted)]">
                      {memory.source}
                    </span>
                    {memory.is_resolved ? (
                      <span className="status-chip bg-white/80 px-3 py-1 text-xs text-[var(--color-muted)]">沉底</span>
                    ) : null}
                    <button className={iconButtonClass(memory.is_pinned)} onClick={() => togglePin(memory)} type="button">
                      <Pin size={16} />
                    </button>
                    <button className={iconButtonClass(false)} onClick={() => toggleArchive(memory)} type="button">
                      {memory.is_active ? <Archive size={16} /> : <RotateCcw size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-chip bg-white/72 px-3 py-2">
      <span className="font-semibold text-[var(--color-text)]">{label}</span>
      <span className="ml-1">{value}</span>
    </div>
  );
}

function tabClass(active: boolean) {
  return [
    "segmented-button h-10 text-sm font-semibold transition",
    active ? "is-selected bg-[var(--color-primary)] text-white shadow-card" : "bg-white/70 text-[var(--color-muted)]"
  ].join(" ");
}

function iconButtonClass(active: boolean) {
  return [
    "icon-action flex h-9 w-9 items-center justify-center transition",
    active ? "is-selected bg-[var(--color-primary)] text-white" : "bg-white/80 text-[var(--color-muted)]"
  ].join(" ");
}
