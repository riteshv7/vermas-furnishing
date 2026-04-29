import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Our Story | Three Generations of Craftsmanship | Verma's Furnishing",
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
          <h1 className={styles.heroTitle}>Three Generations of<br />Hand-Carved Memories.</h1>
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
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Special Editorial Testimonials (Split Grid Version) ── */}
      <section className={styles.editorialSection}>
        <div className={styles.editorialHeader}>
            <span className={styles.label}>A Legacy in Homes</span>
            <h2 className={styles.editorialTitle}>The Verma's Experience</h2>
        </div>

        <div className={styles.editorialGrid}>
            {/* Review 1 */}
            <div className={styles.editorialCard}>
                <div className={styles.editorialCardImage}>
                    <Image 
                        src="/products/luxury-living-room.jpg" 
                        alt="Royal Living Room" 
                        fill 
                        className={styles.featureImg} 
                    />
                </div>
                <div className={styles.editorialCardContent}>
                    <span className={styles.cardLabel}>The Family Home</span>
                    <h3>"The day our Royal Velvet Sofa arrived, our house finally felt like a home. The craftsmanship is unlike anything we've seen in India."</h3>
                    <p>It's not just furniture; it's a member of the family now. Every time we have guests, the first thing they notice is the intricate carving and the sheer comfort of the velvet.</p>
                    <cite>— Mrs. Advani, Cuffe Parade</cite>
                </div>
            </div>

            {/* Review 2 */}
            <div className={styles.editorialCard}>
                <div className={styles.editorialCardContent} style={{ background: '#604334', color: '#fff' }}>
                    <span className={styles.cardLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Custom Creations</span>
                    <h3 style={{ color: '#fff' }}>"We asked for the impossible, and they carved it into reality."</h3>
                    <p>Our custom headboard was a dream inspired by a 1920s sketch. They didn't just replicate it; they improved it with modern reinforcements that will last a lifetime.</p>
                    <cite style={{ color: 'rgba(255,255,255,0.6)' }}>— The Kapoor Family, Bandra</cite>
                </div>
                <div className={styles.editorialCardImage}>
                    <Image 
                        src="/products/arched-channel-headboard.jpg" 
                        alt="Custom Headboard" 
                        fill 
                        className={styles.featureImg} 
                    />
                </div>
            </div>

            {/* Review 3 */}
            <div className={styles.editorialCard}>
                <div className={styles.editorialCardImage}>
                    <Image 
                        src="/products/contemporary-marble-dining-full.jpg" 
                        alt="Marble Dining" 
                        fill 
                        className={styles.featureImg} 
                    />
                </div>
                <div className={styles.editorialCardContent}>
                    <span className={styles.cardLabel}>The Designer's Choice</span>
                    <h3>"Precision in every grain. I've worked with many brands, but the honesty in Verma's materials is what keeps me coming back."</h3>
                    <p>Working with the Verma team on my latest BKC project was seamless. They understood the nuances of the marble grain better than the quarry themselves.</p>
                    <cite>— Rohan Mehta, Principal Architect</cite>
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

      {/* ── Our Commitment ── */}
      <section className={styles.commitSection}>
        <span className={styles.label}>Our Commitment</span>
        <h2 className={styles.commitTitle}>Made Responsibly. Built to Last.</h2>
        <p className={styles.commitText}>
          Sustainability, for us, is not a marketing promise — it is the logical
          conclusion of craftsmanship. A piece built to last a lifetime is the
          most sustainable object that can exist.
        </p>
        <div className={styles.commitStats}>
          {[
            { num: "30+", label: "Years" },
            { num: "5,000+", label: "Pieces" },
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
