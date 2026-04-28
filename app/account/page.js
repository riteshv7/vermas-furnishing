"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../context/UserContext";
import { 
  LogOut,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Heart,
  X,
  ShoppingBag
} from "lucide-react";
import styles from "./account.module.css";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <span>Loading your profile...</span>
      </div>
    );
  }

  if (!session) return null;

  const firstName = session.user.name?.split(' ')[0] || 'there';
  const userInitial = session.user.name?.charAt(0)?.toUpperCase() || 'U';

  // Build WhatsApp message from wishlist
  const wishlistMessage = wishlist.length > 0
    ? `Hi, I'm ${session.user.name}. I'm interested in these pieces:\n${wishlist.map(item => `• ${item.name}`).join('\n')}\n\nCan you share pricing and availability?`
    : `Hi, I'm ${session.user.name}. I'd like to discuss some furniture pieces.`;

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        
        {/* Hero Welcome Section */}
        <motion.section 
          className={styles.heroSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroContent}>
            <div className={styles.avatarLarge}>
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name} fill />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className={styles.heroText}>
              <p className={styles.heroGreeting}>Welcome back</p>
              <h1 className={styles.heroName}>{session.user.name}</h1>
              <p className={styles.heroEmail}>{session.user.email}</p>
            </div>
          </div>
          <button 
            className={styles.signOutBtn} 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </motion.section>

        {/* WhatsApp Concierge — Full Width */}
        <motion.section 
          className={styles.conciergeCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className={styles.conciergeInner}>
            <div className={styles.conciergeText}>
              <div className={styles.conciergeLabel}>
                <Sparkles size={14} />
                <span>Personal Concierge</span>
              </div>
              <h2>Need help choosing the perfect piece?</h2>
              <p>Our interior specialists are available on WhatsApp to help you find exactly what you&apos;re looking for — from custom quotations to design consultations.</p>
            </div>
            <div className={styles.conciergeActions}>
              <a 
                href={`https://wa.me/919821197173?text=${encodeURIComponent(wishlistMessage)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
              <a href="tel:+919821197173" className={styles.callBtn}>
                <Phone size={18} />
                Call Us
              </a>
            </div>
          </div>
        </motion.section>

        {/* Wishlist Section */}
        <motion.section 
          className={styles.wishlistSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Heart size={20} strokeWidth={1.5} />
              <h2>Saved Collection</h2>
            </div>
            <span className={styles.itemCount}>{wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'}</span>
          </div>

          {wishlist.length > 0 ? (
            <>
              <div className={styles.wishlistGrid}>
                {wishlist.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className={styles.wishlistItem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <div className={styles.wishlistImgWrap}>
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={styles.wishlistPlaceholder}>
                          <ShoppingBag size={24} />
                        </div>
                      )}
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove from wishlist"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className={styles.wishlistName}>{item.name}</p>
                  </motion.div>
                ))}
              </div>
              <a 
                href={`https://wa.me/919821197173?text=${encodeURIComponent(wishlistMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enquireAllBtn}
              >
                <MessageCircle size={18} />
                Enquire About All {wishlist.length} Pieces
              </a>
            </>
          ) : (
            <div className={styles.emptyWishlist}>
              <Heart size={40} strokeWidth={1} />
              <h3>Your collection is empty</h3>
              <p>Browse our catalog and tap the heart icon to save pieces you love.</p>
              <Link href="/catalog" className={styles.browseBtn}>
                Browse Catalog
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
