import { Heart, MessageCircle, SendHorizonal } from "lucide-react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { CompanionAvatar } from "@/components/CompanionAvatar";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/dates";
import { getMoments } from "@/lib/server-data";
import { siteConfig } from "@/lib/site-config";
import type { Moment } from "@/types/site";

type MomentsPageProps = {
  moments: Moment[];
};

type CommentsByMoment = Record<string, string[]>;
type DraftsByMoment = Record<string, string>;

export const getServerSideProps: GetServerSideProps<MomentsPageProps> = async () => {
  return { props: { moments: await getMoments() } };
};

export default function MomentsPage({ moments }: MomentsPageProps) {
  const [likedMomentIds, setLikedMomentIds] = useState<string[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<DraftsByMoment>({});
  const [comments, setComments] = useState<CommentsByMoment>({});

  function toggleLike(momentId: string) {
    setLikedMomentIds((current) =>
      current.includes(momentId) ? current.filter((id) => id !== momentId) : [...current, momentId]
    );
  }

  function submitComment(event: FormEvent<HTMLFormElement>, momentId: string) {
    event.preventDefault();
    const draft = commentDrafts[momentId]?.trim();

    if (!draft) {
      return;
    }

    setComments((current) => ({
      ...current,
      [momentId]: [...(current[momentId] ?? []), draft]
    }));
    setCommentDrafts((current) => ({ ...current, [momentId]: "" }));
  }

  return (
    <AppLayout title="Moments">
      <PageHeader eyebrow="Moments" title="朋友圈" />

      <div className="overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white/82 shadow-card">
        <div className="relative h-40 bg-[var(--color-secondary)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_34%),linear-gradient(135deg,var(--color-secondary),var(--color-background))]" />
          <div className="absolute bottom-[-28px] right-5 flex items-end gap-3">
            <span className="pb-2 text-xl font-semibold text-[var(--color-text)]">{siteConfig.name}</span>
            <CompanionAvatar size={72} />
          </div>
        </div>

        <div className="space-y-0 px-4 pb-5 pt-11">
          {moments.map((moment) => {
            const isLiked = likedMomentIds.includes(moment.id);
            const momentComments = comments[moment.id] ?? [];

            return (
              <article className="border-b border-[var(--color-border)] py-5 last:border-b-0" key={moment.id}>
                <div className="flex gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[var(--color-secondary)]">
                    <Image src={siteConfig.avatar} alt={siteConfig.name} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-semibold text-[#576B95]">{siteConfig.name}</h2>
                    <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-text)]">
                      {moment.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-muted)]">
                      <span>{formatDate(moment.created_at)}</span>
                      <div className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-3 py-1.5">
                        <button
                          className={[
                            "inline-flex items-center gap-1 transition",
                            isLiked ? "text-[#d46d8c]" : "text-[var(--color-muted)]"
                          ].join(" ")}
                          onClick={() => toggleLike(moment.id)}
                          type="button"
                        >
                          <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                          赞
                        </button>
                        <span className="h-3 w-px bg-[var(--color-border)]" />
                        <a className="inline-flex items-center gap-1 text-[var(--color-muted)]" href={`#comment-${moment.id}`}>
                          <MessageCircle size={14} />
                          评论
                        </a>
                      </div>
                    </div>

                    {(isLiked || momentComments.length > 0) ? (
                      <div className="mt-3 rounded-xl bg-[var(--color-secondary)] px-3 py-2 text-sm">
                        {isLiked ? (
                          <p className="font-medium text-[#576B95]">
                            你
                          </p>
                        ) : null}
                        {momentComments.map((comment, index) => (
                          <p className="mt-1 leading-relaxed" key={`${moment.id}-${comment}-${index}`}>
                            <span className="font-medium text-[#576B95]">你：</span>
                            {comment}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <form
                      className="mt-3 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/78 px-3 py-2"
                      id={`comment-${moment.id}`}
                      onSubmit={(event) => submitComment(event, moment.id)}
                    >
                      <input
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
                        onChange={(event) =>
                          setCommentDrafts((current) => ({ ...current, [moment.id]: event.target.value }))
                        }
                        placeholder="写评论..."
                        value={commentDrafts[moment.id] ?? ""}
                      />
                      <button
                        aria-label="Send comment"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white disabled:opacity-40"
                        disabled={!commentDrafts[moment.id]?.trim()}
                        type="submit"
                      >
                        <SendHorizonal size={15} />
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
