import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WishlistFloat from "@/components/WishlistFloat";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Verma's Furnishing | Premium Sofas, Dining & Home Decor | Mumbai",
  description: "Handcrafted luxury furniture tailored to your space. Visit our showroom in Mumbai for premium sofas, dining sets, and bespoke home furnishings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <UserProvider>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <WishlistFloat />
        </UserProvider>
      </body>
    </html>
  );
}
