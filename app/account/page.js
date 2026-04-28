"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  CreditCard
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
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
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
                <p>Premium Member</p>
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
                <p>Manage your curated collection, track your bespoke furniture deliveries, and update your styling preferences.</p>
              </div>

              <div className={styles.dashboardGrid}>
                {/* Ongoing Orders */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Ongoing Orders</h2>
                    <Link href="#" className={styles.viewAll}>View All</Link>
                  </div>
                  <div className={styles.orderItem}>
                    <div className={styles.orderImg}>
                       <div className={styles.placeholderImg}>🪑</div>
                    </div>
                    <div className={styles.orderDetails}>
                      <h4>Bespoke Nordic Oak Armchair</h4>
                      <p>Order #LX-99238 • Expected Aug 24</p>
                    </div>
                    <span className={styles.statusTag}>In Workshop</span>
                  </div>
                  <div className={styles.orderItem}>
                    <div className={styles.orderImg}>
                       <div className={styles.placeholderImg}>🪑</div>
                    </div>
                    <div className={styles.orderDetails}>
                      <h4>Carrara Marble Coffee Table</h4>
                      <p>Order #LX-99210 • Delivered July 12</p>
                    </div>
                    <span className={`${styles.statusTag} ${styles.delivered}`}>Delivered</span>
                  </div>
                </div>

                {/* Loyalty / Info */}
                <div className={`${styles.card} ${styles.loyaltyCard}`}>
                  <h3>Loyalty Program</h3>
                  <div className={styles.tierInfo}>
                    <h4>Elite Tier Status</h4>
                    <p>You have 4,500 LUXE Points available for your next curated purchase.</p>
                  </div>
                  <button className={styles.redeemBtn}>Redeem Rewards</button>
                </div>
              </div>

              {/* Security & Payment */}
              <div className={styles.footerGrid}>
                <div className={styles.smallCard}>
                  <ShieldCheck size={24} className={styles.cardIcon} />
                  <div>
                    <h4>Security & Privacy</h4>
                    <p>Update your password and manage two-factor authentication.</p>
                  </div>
                </div>
                <div className={styles.smallCard}>
                  <CreditCard size={24} className={styles.cardIcon} />
                  <div>
                    <h4>Payment Methods</h4>
                    <p>Manage your saved credit cards and billing information.</p>
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
