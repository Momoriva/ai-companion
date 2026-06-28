import { BookOpenText, Brush, Feather, Home, MessageCircle, Moon, SendHorizonal, Sparkles, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./PreviewThemePage.module.css";
import { PreviewTheme } from "./yanyunNightPreviewTheme";

type PreviewCardProps = {
  children: ReactNode;
  className?: string;
};

export function PreviewCard({ children, className = "" }: PreviewCardProps) {
  return (
    <section className={`${styles.paperCard} ${className}`}>
      <div className={styles.cardInner}>{children}</div>
    </section>
  );
}

export function PreviewAvatar() {
  return (
    <div className={styles.avatar}>
      <img src={PreviewTheme.assets.avatar} alt="AI Companion preview wuxia swordsman avatar" />
    </div>
  );
}

export function PreviewCompanionIntro() {
  return (
    <PreviewCard>
      <div className={styles.profileRow}>
        <PreviewAvatar />
        <div>
          <p className={styles.bodyText}>Peaceful courtyard at night</p>
          <h2 className={styles.heading}>AI Companion</h2>
          <p className={styles.bodyText}>
            A quiet blue-toned preview direction with rice-paper surfaces, ink-wash depth,
            restrained golden leaf accents, and an original wuxia swordsman companion portrait.
          </p>
        </div>
      </div>
    </PreviewCard>
  );
}

export function PreviewNav() {
  const items = [
    { label: "Home", icon: Home, active: true },
    { label: "Chat", icon: MessageCircle },
    { label: "Moments", icon: Sparkles },
    { label: "Memory", icon: BookOpenText },
    { label: "Profile", icon: UserRound }
  ];

  return (
    <div className={styles.paperCard}>
      <div className={styles.previewNav}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className={`${styles.navItem} ${item.active ? styles.navItemActive : ""}`} key={item.label}>
              <Icon aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PreviewChatPanel() {
  return (
    <div className={`${styles.paperCard} ${styles.chatPanel}`}>
      <div className={styles.chatWindow}>
        <div className={styles.message}>今晚的风很轻，适合慢慢说话。</div>
        <div className={`${styles.message} ${styles.reply}`}>那就从一句安静的问候开始。</div>
      </div>
      <div className={styles.chatInput}>
        <input className={styles.input} placeholder="Write softly..." aria-label="Preview message input" />
        <button className={styles.button} aria-label="Preview send" type="button">
          <SendHorizonal aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function PreviewControls() {
  return (
    <PreviewCard>
      <h2 className={styles.cardTitle}>Component previews</h2>
      <p className={styles.bodyText}>PreviewButton, PreviewInput, PreviewCard, and PreviewAvatar use the same quiet token set.</p>
      <div className={styles.controls}>
        <button className={styles.button} type="button">
          <Feather aria-hidden="true" />
        </button>
        <button className={`${styles.button} ${styles.buttonSecondary}`} type="button">
          <Brush aria-hidden="true" />
        </button>
        <button className={`${styles.button} ${styles.buttonGold}`} type="button">
          <Sparkles aria-hidden="true" />
        </button>
      </div>
      <div className={styles.chatInput}>
        <input className={styles.input} placeholder="PreviewInput" aria-label="Preview input" />
      </div>
    </PreviewCard>
  );
}

export function PreviewDesignIntent() {
  return (
    <PreviewCard>
      <span className={styles.iconMark}>
        <Moon aria-hidden="true" />
      </span>
      <h2 className={styles.cardTitle}>Design intent</h2>
      <p className={styles.bodyText}>
        Apple-level simplicity meets Song Dynasty restraint: silence, balance, breathing space,
        moonlight, nature, ink painting, and warm humanity without gaming or sci-fi cues.
      </p>
    </PreviewCard>
  );
}
