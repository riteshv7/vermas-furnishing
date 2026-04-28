"use client";

import { useUser } from "../../context/UserContext";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import styles from "./cart.module.css";
import ProductCard from "@/components/ProductCard";

export default function CartPage() {
  const { wishlist, removeFromWishlist } = useUser();

  // Pick 4 curated products (excluding those already in cart)
  const curatedProducts = products
    .filter(p => !wishlist.some(item => item.id === p.id))
    .slice(0, 4);

  const whatsappMessage = wishlist.length > 0
    ? `Hi, I'm interested in the following pieces from your collection:\n\n${wishlist.map(item => `• ${item.name}`).join('\n')}\n\nCould you please share the pricing and availability?`
    : "";

  return (
    <div className={styles.container}>
      <div className="container">
        <header className={styles.header}>
          <h1>Your Shopping Bag</h1>
          <p className={styles.itemCount}>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
        </header>

        {wishlist.length > 0 ? (
          <div className={styles.cartLayout}>
            {/* Main Cart Items */}
            <div className={styles.cartItems}>
              {wishlist.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.placeholder}>🪑</div>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemMain}>
                      <h3>{item.name}</h3>
                      <p className={styles.itemCategory}>Bespoke Furniture Inquiry</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className={styles.removeBtn}
                      >
                        <Trash2 size={16} />
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Inquiry Summary Sidebar */}
            <aside className={styles.summary}>
              <div className={styles.summaryCard}>
                <h2>Inquiry Summary</h2>
                <div className={styles.summaryRow}>
                  <span>Total Items</span>
                  <span>{wishlist.length}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Estimated Shipping</span>
                  <span>Calculated at Inquiry</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax</span>
                  <span>TBD</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>Price on Request</span>
                </div>
                
                <a 
                  href={`https://wa.me/919821197173?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.checkoutBtn}
                >
                  <MessageCircle size={20} />
                  REQUEST QUOTATION VIA WHATSAPP
                </a>
                
                <p className={styles.secureNote}>
                  Your inquiry will be handled directly by our interior specialists for a personalized experience.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <ShoppingBag size={48} strokeWidth={1} />
            <h2>Your bag is currently empty</h2>
            <p>Discover our collection and add pieces you love to your inquiry bag.</p>
            <Link href="/catalog" className={styles.continueBtn}>
              EXPLORE COLLECTION
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Curated for You */}
        {curatedProducts.length > 0 && (
          <section className={styles.curated}>
            <h2>Curated for You</h2>
            <div className={styles.curatedGrid}>
              {curatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
