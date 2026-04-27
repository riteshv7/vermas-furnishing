import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Our Story - Verma's Furnishing",
  description: "Three generations of handcrafted furniture, born in Mumbai. Discover the story, craft, and philosophy behind every Verma's piece.",
};

const pillars = [
  {
    title: "The Archival Mindset",
    text: "We maintain a library of over 12,000 original sketches, ensuring the DNA of our founders lives in every modern silhouette.",
  },
  {
    title: "Living Heritage",
    text: "Legacy is not about the past; it is about creating pieces durable enough to become the heirlooms of your grandchildren.",
  },
  {
    title: "Artisanal Honesty",
    text: "No machine can replicate the intuition of a human eye. Every grain is selected, every joint hand-fitted.",
  },
];

export default function OurStoryPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/products/our-story-banner.jpg"
            alt="Verma's craftsmanship"
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Our Story</span>
          <h1 className={styles.heroTitle}>A Century of<br />Hand-Carved Memories.</h1>
        </div>
      </section>

      {/* ── Opening Statement ── */}
      <section className={styles.openingSection}>
        <div className={styles.openingGrid}>
          <div className={styles.openingText}>
            <span className={styles.label}>Origins</span>
            <p className={styles.openingBody}>
              Verma's was born in the heart of Mumbai's artisan district, where our
              founders first laid chisel to cedar. For three generations, we have
              honoured the philosophy that a home is not furnished, but curated over
              time through objects of soul.
            </p>
            <p className={styles.openingBody}>
              Every curve is considered. Every joint reinforced. Every finish
              hand-applied — so your piece lasts for generations, not seasons.
            </p>
          </div>
          <div className={styles.openingImageStack}>
            <div className={styles.openingImgLarge}>
              <Image
                src="/products/origins-showroom.jpg"
                alt="Verma's showroom"
                fill
                className={styles.stackImage}
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </div>
            <div className={styles.openingImgSmall}>
              <Image
                src="/products/origins-sofa.jpg"
                alt="Handcrafted sofa"
                fill
                className={styles.stackImage}
                sizes="(max-width:768px) 0vw, 20vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsHeader}>
          <span className={styles.label}>What We Believe</span>
          <h2 className={styles.pillarsTitle}>The Philosophy Behind Every Piece</h2>
        </div>
        <div className={styles.pillarsGrid}>
          {pillars.map((p, i) => (
            <div key={i} className={styles.pillarCard}>
              <div className={styles.pillarNumber}>0{i + 1}</div>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarText}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founder Quote ── */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteInner}>
          <div className={styles.quoteMark}>"</div>
          <blockquote className={styles.quoteText}>
            We do not build furniture. We build the silent witnesses to your
            life's most intimate moments.
          </blockquote>
          <cite className={styles.quoteCite}>— Verma's Furnishing, Mumbai</cite>
        </div>
        <div className={styles.quoteImageWrapper}>
          <Image
            src="/products/grey-daybed-brass.jpg"
            alt="Verma's signature piece"
            fill
            className={styles.quoteImage}
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* ── Our Commitment ── */}
      <section className={styles.commitSection}>
        <span className={styles.label}>Our Commitment to Earth</span>
        <h2 className={styles.commitTitle}>Made Responsibly. Built to Last.</h2>
        <p className={styles.commitText}>
          Sustainability, for us, is not a marketing promise — it is the logical
          conclusion of craftsmanship. A piece built to last a lifetime is the
          most sustainable object that can exist. We source our materials from
          verified suppliers, use water-based finishes, and ensure zero off-cuts
          go to landfill.
        </p>
        <div className={styles.commitStats}>
          {[
            { num: "30+", label: "Years in Mumbai" },
            { num: "5,000+", label: "Pieces Crafted" },
            { num: "100%", label: "Hand-finished" },
            { num: "3", label: "Generations" },
          ].map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Experience the Craft</h2>
        <p className={styles.ctaSub}>Browse our full collection or speak with our consultants.</p>
        <div className={styles.ctaBtns}>
          <Link href="/catalog" className={styles.ctaBtnPrimary}>Explore Catalog</Link>
          <a
            href="https://wa.me/919821197173?text=Hi, I'd love to learn more about Verma's Furnishing"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtnSecondary}
          >
            Talk to Us
          </a>
        </div>
      </section>
    </div>
  );
}
