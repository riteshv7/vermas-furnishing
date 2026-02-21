import { Inter, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WishlistFloat from "@/components/WishlistFloat";
import BackToTop from "@/components/BackToTop";
import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";
import { CustomCursor } from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-cormorant" });

export const metadata = {
  title: "Verma's Furnishing | Premium Sofas, Dining & Home Decor | Mumbai",
  description: "Handcrafted luxury furniture tailored to your space. Visit our showroom in Mumbai for premium sofas, dining sets, and bespoke home furnishings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} ${cormorant.variable}`}>
        <CustomCursor />
        <ToastProvider>
          <UserProvider>
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
              {children}
            </main>
            <Footer />
            <WhatsAppFloat />
            <WishlistFloat />
            <BackToTop />
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
