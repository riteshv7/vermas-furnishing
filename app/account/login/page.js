"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./login.module.css";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  const router = useRouter();
  const { addToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          addToast({
            title: "Login Failed",
            message: result.error,
            type: "error",
          });
        } else {
          addToast({
            title: "Welcome back!",
            message: "Successfully logged in.",
          });
          router.push("/account");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          addToast({
            title: "Account Created",
            message: "You can now log in with your credentials.",
          });
          setIsLogin(true);
        } else {
          addToast({
            title: "Registration Failed",
            message: data.error,
            type: "error",
          });
        }
      }
    } catch (error) {
      addToast({
        title: "Error",
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.splitLayout}>
      {/* Left Side: Visual & Story */}
      <div className={styles.visualSide}>
        <Image 
          src="/products/luxury-living-room.jpg" 
          alt="Verma's Luxury Living Room" 
          fill 
          className={styles.heroImage}
          priority
        />
        <div className={styles.overlay}>
          <motion.div 
            className={styles.storyContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={styles.storyTitle}>Modern Heritage.</h2>
            <p className={styles.storyText}>
              Crafting environments where history and modern living converge in perfect harmony.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className={styles.formSide}>
        <div className={styles.formContent}>
          <motion.div 
            className={styles.brandHeader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className={styles.logoLink}>VERMA'S</Link>
          </motion.div>

          <motion.div 
            className={styles.formHeader}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1>{isLogin ? "Welcome Back" : "Join the Atelier"}</h1>
            <p>{isLogin ? "Sign in to access your bespoke collections." : "Create an account to start your curated journey."}</p>
          </motion.div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Arjun Verma"
                      required={!isLogin}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98XXX XXXXX"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
                {isLogin && <Link href="#" className={styles.forgotPass}>Forgot Password?</Link>}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Processing..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>SECURE ACCESS</span>
          </div>

          <div className={styles.socialWrapper}>
            <button 
              type="button" 
              className={styles.socialBtn}
              onClick={() => signIn("google", { callbackUrl: "/account" })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#000"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className={styles.switchMode}>
            {isLogin ? (
              <p>New to VERMA'S? <button onClick={() => setIsLogin(false)}>Create an Account</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign In</button></p>
            )}
          </div>
        </div>

        <footer className={styles.formFooter}>
          <div className={styles.footerLinks}>
            <Link href="#">PRIVACY</Link>
            <Link href="#">TERMS</Link>
            <Link href="#">SUSTAINABILITY</Link>
            <Link href="#">PRESS</Link>
          </div>
          <p className={styles.copyright}>© 2026 VERMA'S. PURVEYORS OF MODERN HERITAGE.</p>
        </footer>
      </div>
    </div>
  );
}
