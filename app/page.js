import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import ShopTheLook from "@/components/ShopTheLook";
import Features from "@/components/Features";
import FadeIn from "@/components/FadeIn";
import { products } from "@/data/products";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  // Get featured products (first 4 or explicitly marked)
  const featuredProducts = products.filter(p => p.featured).slice(0, 2);
  const newArrivals = products.slice(0, 4);

  return (
    <div className={styles.page}>
      <Hero />

      <FadeIn>
        <CategoryGrid />
      </FadeIn>

      <FadeIn direction="up">
        <ShopTheLook />
      </FadeIn>

      <FadeIn direction="up" delay={0.2}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>Featured Collections</h2>
              <p className={styles.subtitle}>Handpicked pieces that define luxury and comfort</p>
            </div>

            <div className={styles.grid}>
              {newArrivals.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className={styles.centerBtn}>
              <Link href="/catalog" className="btn btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn direction="up">
        <Features />
      </FadeIn>
    </div>
  );
}
