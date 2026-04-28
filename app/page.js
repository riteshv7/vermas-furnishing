import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import InstagramFeed from "@/components/InstagramFeed";
import styles from "./page.module.css";

export default function Home() {
  const newArrivals = products.slice(0, 4);

  // Hand-pick 3 collection showcase images
  const collections = [
    {
      label: "Sofas & Sectionals",
      title: "The Tufted Elegance Series",
      sub: "Timeless Design & Premium Velvet",
      image: "/products/featured-sofa.jpg",
      href: "/catalog?category=Sofas",
    },
    {
      label: "Dining",
      title: "Artisan Dining",
      sub: "Marble, Oak & Cane",
      image: "/products/round-marble-gold.jpg",
      href: "/catalog?category=Dining",
    },
    {
      label: "Chairs & Ottomans",
      title: "Botanical Accent Series",
      sub: "Tufted Backs & Tropical Prints",
      image: "/products/featured-chairs.jpg",
      href: "/catalog?category=Chairs",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Existing Hero — unchanged */}
      <Hero />

      {/* ── Featured Collections ── */}
      <FadeIn direction="up">
        <section className={styles.collectionsSection}>
          <div className={styles.collectionsHeader}>
            <span className={styles.sectionLabel}>Our Collections</span>
            <h2 className={styles.collectionsTitle}>Featured Collections</h2>
            <p className={styles.collectionsSub}>
              Each piece is a testament to our philosophy: that furniture should
              not merely occupy space, but define it through texture, form, and soul.
            </p>
          </div>

          <div className={styles.collectionsGrid}>
            {collections.map((col, i) => (
              <Link key={i} href={col.href} className={styles.collectionCard}>
                <div className={styles.collectionImageWrapper}>
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className={styles.collectionImage}
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className={styles.collectionOverlay}>
                    <span className={styles.collectionLabel}>{col.label}</span>
                    <h3 className={styles.collectionName}>{col.title}</h3>
                    <p className={styles.collectionSub}>{col.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.viewAllWrap}>
            <Link href="/catalog" className={styles.viewAllLink}>
              View all series →
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* ── Founder Quote ── */}
      <FadeIn direction="up">
        <section className={styles.quoteSection}>
          <div className={styles.quoteMark}>"</div>
          <blockquote className={styles.quoteText}>
            A piece of furniture should tell a story before anyone even sits on it.
          </blockquote>
          <cite className={styles.quoteCite}>— Verma's Furnishing, Mumbai</cite>
        </section>
      </FadeIn>

      {/* ── New Arrivals Grid ── */}
      <FadeIn direction="up" delay={0.15}>
        <section className={styles.arrivalsSection}>
          <div className="container">
            <div className={styles.arrivalHeader}>
              <div>
                <span className={styles.sectionLabel}>Just In</span>
                <h2 className={styles.arrivalsTitle}>New Arrivals</h2>
              </div>
              <Link href="/catalog" className={styles.viewAllLink}>View all →</Link>
            </div>
            <div className={styles.grid}>
              {newArrivals.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Craftsmanship Story ── */}
      <FadeIn direction="up">
        <section className={styles.craftSection}>
          <div className={styles.craftImageCol}>
            <div className={styles.craftImageWrapper}>
              <Image
                src="/products/craft-showroom.jpg"
                alt="Craftsmanship at Verma's"
                fill
                className={styles.craftImage}
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className={styles.craftContent}>
            <span className={styles.sectionLabel}>Our Legacy</span>
            <h2 className={styles.craftTitle}>Three Generations of Quiet Craftsmanship</h2>
            <p className={styles.craftText}>
              Founded in the heart of Mumbai's artisan district, Verma's has
              remained committed to the slow-made movement. We believe in the
              integrity of raw materials and the precision of the human hand.
            </p>
            <p className={styles.craftText}>
              Every curve is considered, every joint reinforced, and every finish
              hand-applied — so your piece lasts for generations.
            </p>
            <Link href="/catalog" className={styles.craftCta}>
              Explore the Collection →
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* ── WhatsApp CTA Banner ── */}
      <FadeIn direction="up">
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <h2 className={styles.ctaBannerTitle}>Elevate Your Living Space</h2>
            <p className={styles.ctaBannerSub}>
              Our design consultants work closely with you to curate an
              environment that reflects your unique lifestyle and aesthetic.
            </p>
            <div className={styles.ctaBannerBtns}>
              <Link href="/catalog" className={styles.ctaBtnPrimary}>
                Browse Catalog
              </Link>
              <a
                href="https://wa.me/919821197173?text=Hi, I'm interested in your products"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtnWhatsapp}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Free Consultation
              </a>
            </div>
          </div>
        </section>
      </FadeIn>
      <InstagramFeed />
    </div>
  );
}
