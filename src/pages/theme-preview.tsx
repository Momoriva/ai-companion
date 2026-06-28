import Head from "next/head";
import {
  PreviewCard,
  PreviewChatPanel,
  PreviewCompanionIntro,
  PreviewControls,
  PreviewDesignIntent,
  PreviewNav
} from "@/preview/PreviewComponents";
import styles from "@/preview/PreviewThemePage.module.css";
import { PreviewTheme } from "@/preview/yanyunNightPreviewTheme";

const palette = [
  ["Deep Ink Blue", PreviewTheme.colors.deepInkBlue],
  ["Muted Navy", PreviewTheme.colors.mutedNavy],
  ["Slate Blue", PreviewTheme.colors.slateBlue],
  ["Fog Blue", PreviewTheme.colors.fogBlue],
  ["Moon White", PreviewTheme.colors.moonWhite],
  ["Stone Gray", PreviewTheme.colors.stoneGray],
  ["Golden Leaf", PreviewTheme.colors.goldenLeaf]
];

const screens = [
  ["Home", "Avatar, quiet status, daily note, and recent moments arranged with generous white space."],
  ["Chat", "Low-contrast rice-paper conversation surface for long, comfortable reading."],
  ["Profile", "Scholar portrait, persona, and worldview presented as pages from a restrained book."]
];

export default function ThemePreviewPage() {
  return (
    <div className={styles.previewRoot}>
      <Head>
        <title>Preview Theme - Yanyun Night</title>
        <meta
          name="description"
          content="Isolated AI Companion preview theme inspired by moonlit forests, ink painting, rice paper, and Song Dynasty restraint."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <main className={styles.shell}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Preview namespace only</p>
          <h1 className={styles.title}>{PreviewTheme.name}</h1>
          <p className={styles.subtitle}>
            A self-contained visual direction for review: modern product clarity, moonlit nature,
            ink-wash atmosphere, rice-paper containers, and restrained cultural depth.
          </p>
        </header>

        <div className={styles.stack}>
          <PreviewCompanionIntro />
          <PreviewDesignIntent />

          <div className={styles.gridTwo}>
            <PreviewChatPanel />
            <div className={styles.stack}>
              <PreviewNav />
              <PreviewControls />
            </div>
          </div>

          <section className={styles.screenStrip}>
            {screens.map(([title, description]) => (
              <PreviewCard className={styles.miniScreen} key={title}>
                <h2 className={styles.cardTitle}>{title} preview</h2>
                <p className={styles.bodyText}>{description}</p>
              </PreviewCard>
            ))}
          </section>

          <PreviewCard>
            <h2 className={styles.cardTitle}>Preview palette</h2>
            <div className={styles.palette}>
              {palette.map(([label, color]) => (
                <div className={styles.swatchRow} key={label}>
                  <span className={styles.swatch} style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </PreviewCard>
        </div>
      </main>
    </div>
  );
}
