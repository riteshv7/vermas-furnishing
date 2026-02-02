import styles from './Features.module.css';
import { Award, PenTool, Truck, Users, Home, Settings } from 'lucide-react';

const features = [
    {
        icon: <Users size={24} />,
        title: "Family Legacy & Expertise",
        description: "Generations of furniture craftsmanship since 2000, blending traditional techniques with modern innovation to create timeless pieces."
    },
    {
        icon: <PenTool size={24} />,
        title: "Full Customization",
        description: "Tailor every detail to your space. From dimensions and materials to style and finishing, we build exactly what you envision."
    },
    {
        icon: <Truck size={24} />,
        title: "End-to-End Service",
        description: "We handle everything under one roof: design, manufacturing, professional installation, and reliable after-sales support."
    },
    {
        icon: <Home size={24} />,
        title: "Pan-India Delivery",
        description: "Based in Mumbai but serving residential, commercial, and institutional clients across India with dedicated logistics."
    },
    {
        icon: <Settings size={24} />,
        title: "Comprehensive Solutions",
        description: "From custom sofas and mattresses to motorized blinds and automation – a complete furnishing solution provider."
    },
    {
        icon: <Award size={24} />,
        title: "Quality Committed",
        description: "We pride ourselves on using premium materials and delivering superior durability that stands the test of time."
    }
];

export default function Features() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Why Choose VERMA'S?</h2>
                    <p className={styles.description}>
                        VERMA'S is a family-owned brand dedicated to transforming homes and workspaces through quality furnishings and innovative solutions.
                        Combining decades of craftsmanship with a passion for modern design, we offer a comprehensive range of products for every room.
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureText}>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>2000</span>
                        <span className={styles.statLabel}>Established</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>25+</span>
                        <span className={styles.statLabel}>Years Experience</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>1000+</span>
                        <span className={styles.statLabel}>Projects Completed</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>100%</span>
                        <span className={styles.statLabel}>Customizable</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
