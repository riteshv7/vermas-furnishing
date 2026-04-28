"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  MessageSquare, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import styles from "./account.module.css";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading your profile...</div>;
  }

  if (!session) return null;

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "enquiries", label: "My Enquiries", icon: MessageSquare },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Shipping", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.userBrief}>
              <div className={styles.avatar}>
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name} fill />
                ) : (
                  <span>{session.user.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <h3>{session.user.name}</h3>
                <p>Curated Member</p>
              </div>
            </div>

            <nav className={styles.nav}>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.active : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <main className={styles.content}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.welcomeHeader}>
                <h1>Welcome back, {session.user.name.split(' ')[0]}</h1>
                <p>Manage your curated collection, track your furniture enquiries, and connect with your personal interior concierge.</p>
              </div>

              <div className={styles.dashboardGrid}>
                {/* Recent Enquiries */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Recent Enquiries</h2>
                    <Link href="#" className={styles.viewAll}>View History</Link>
                  </div>
                  <div className={styles.orderItem}>
                    <div className={styles.orderImg}>
                       <div className={styles.placeholderImg}>🪑</div>
                    </div>
                    <div className={styles.orderDetails}>
                      <h4>Bespoke Nordic Oak Armchair</h4>
                      <p>Inquiry #EN-99238 • June 24, 2026</p>
                    </div>
                    <span className={styles.statusTag}>Quotation Sent</span>
                  </div>
                  <div className={styles.orderItem}>
                    <div className={styles.orderImg}>
                       <div className={styles.placeholderImg}>🪑</div>
                    </div>
                    <div className={styles.orderDetails}>
                      <h4>Carrara Marble Coffee Table</h4>
                      <p>Inquiry #EN-99210 • June 12, 2026</p>
                    </div>
                    <span className={`${styles.statusTag} ${styles.delivered}`}>Consultation Scheduled</span>
                  </div>
                </div>

                {/* Concierge Card */}
                <div className={`${styles.card} ${styles.loyaltyCard}`}>
                  <h3>Personal Concierge</h3>
                  <div className={styles.tierInfo}>
                    <h4>Direct WhatsApp Support</h4>
                    <p>Have questions about a piece or want a custom quotation? Chat directly with our interior specialists.</p>
                  </div>
                  <a 
                    href="https://wa.me/919820265115" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.redeemBtn}
                    style={{ backgroundColor: '#25D366', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Security & Support */}
              <div className={styles.footerGrid}>
                <div className={styles.smallCard}>
                  <ShieldCheck size={24} className={styles.cardIcon} />
                  <div>
                    <h4>Security & Privacy</h4>
                    <p>Update your password and manage your account preferences.</p>
                  </div>
                </div>
                <div className={styles.smallCard}>
                  <MessageSquare size={24} className={styles.cardIcon} />
                  <div>
                    <h4>Enquiry Help</h4>
                    <p>Need assistance with a specific piece? We're here to help.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>

  );
}
