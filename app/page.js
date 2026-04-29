import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import InstagramFeed from "@/components/InstagramFeed";
import styles from "./page.module.css";

export default async function Home() {
  // Fetch products from DB with extreme caution
  let products = [];
  try {
    // Try both lowercase and uppercase just in case of environment differences
    const productModel = prisma.product || prisma.Product;
    
    if (productModel) {
      const dbProducts = await productModel.findMany({
        orderBy: { id: 'desc' },
        take: 20
      });

      products = dbProducts.map(p => ({
        ...p,
        features: p.features ? JSON.parse(p.features) : []
      }));
    } else {
      console.error("Prisma 'product' model not found on client instance.");
    }
  } catch (error) {
    console.error("Home page data fetch error:", error);
  }

  // Hand-pick one from each category so visitors see the full range
  const newArrivals = [
    products.find(p => p.category === 'Dining'),
    products.find(p => p.category === 'Headboards'),
    products.find(p => p.category === 'Ottomans'),
    products.find(p => p.category === 'Tables'),
  ].filter(Boolean);

  // Collections data
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
      <Hero />

      {/* Collections Section */}
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

      {/* Quote Section */}
      <FadeIn direction="up">
        <section className={styles.quoteSection}>
          <div className={styles.quoteMark}>"</div>
          <blockquote className={styles.quoteText}>
            A piece of furniture should tell a story before anyone even sits on it.
          </blockquote>
          <cite className={styles.quoteCite}>— Verma's Furnishing, Mumbai</cite>
        </section>
      </FadeIn>

      {/* New Arrivals Grid */}
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
              {newArrivals.length > 0 ? (
                newArrivals.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', gridColumn: '1 / -1' }}>
                  <p style={{ color: '#666' }}>Connecting to our collection... please refresh in a moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

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
              hand-applied.
            </p>
            <Link href="/catalog" className={styles.craftCta}>
              Explore the Collection →
            </Link>
          </div>
        </section>
      </FadeIn>

      <FadeIn direction="up">
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <h2 className={styles.ctaBannerTitle}>Elevate Your Living Space</h2>
            <p className={styles.ctaBannerSub}>
              Our design consultants work closely with you to curate an
              environment that reflects your unique lifestyle.
            </p>
            <div className={styles.ctaBannerBtns}>
              <Link href="/catalog" className={styles.ctaBtnPrimary}>
                Browse Catalog
              </Link>
              <a
                href="https://wa.me/919821197173"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtnWhatsapp}
              >
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
