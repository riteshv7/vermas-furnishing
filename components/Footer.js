import { Instagram, Linkedin, Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import styles from "./Footer.module.css";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Contact", href: "/contact" },
];

const CATEGORIES = [
  { label: "Sofas", href: "/catalog?category=Sofas" },
  { label: "Dining", href: "/catalog?category=Dining" },
  { label: "Chairs", href: "/catalog?category=Chairs" },
  { label: "Curtains", href: "/catalog?category=Curtains" },
];

const CONTACT_INFO = [
  {
    icon: <Phone size={16} />,
    text: "+91 9821197173",
    href: "tel:+919821197173",
    className: "contactItem",
  },
  {
    icon: <Phone size={16} />,
    text: "+91 9820767297",
    href: "tel:+919820767297",
    className: "contactItem",
  },
  {
    icon: <Mail size={16} />,
    text: "vermasfurnishings@gmail.com",
    href: "mailto:vermasfurnishings@gmail.com",
    className: "contactItem",
  },
  {
    icon: <MessageSquare size={16} />,
    text: "Chat on WhatsApp",
    href: "https://wa.me/919821197173",
    className: "whatsappLink",
    external: true,
  },
];

const SOCIAL_LINKS = [
  {
    icon: <Instagram size={24} />,
    href: "https://instagram.com/vermasfurnishings",
    label: "Instagram",
  },
  {
    icon: <Linkedin size={24} />,
    href: "https://www.linkedin.com/company/verma-s/",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <h3>VERMA'S</h3>
            <p>Comfort | Craftsmanship | Class</p>
            <address className={styles.address}>
              Shop No. 4, Siddheshwar Society,
              <br />
              Bandra (E), Mumbai - 400051
              <br />
              Manufacturing Unit
            </address>
          </div>

          {/* Quick Links */}
          <nav className={styles.links} aria-label="Footer Quick Links">
            <h4>Quick Links</h4>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav className={styles.links} aria-label="Footer Categories">
            <h4>Categories</h4>
            <ul>
              {CATEGORIES.map((category) => (
                <li key={category.label}>
                  <Link href={category.href}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className={styles.contact}>
            <h4>Get in Touch</h4>
            {CONTACT_INFO.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={styles[item.className]}
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.icon} {item.text}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} Verma's Furnishing. All rights
            reserved.
          </p>
          <div className={styles.socials}>
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
