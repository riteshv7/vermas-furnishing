'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './WhatsAppConcierge.module.css';

export default function WhatsAppConcierge() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappUrl = "https://wa.me/919821197173?text=Hi, I'm looking for some luxury furniture pieces for my home.";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    className={styles.container}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        <motion.div 
                            className={`${styles.bubble} ${isExpanded ? styles.expanded : ''}`}
                            animate={{ 
                                width: isExpanded ? '380px' : '64px', // Wider to fit full text
                                borderRadius: isExpanded ? '32px' : '50%'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className={styles.iconWrapper}>
                                <MessageSquare size={24} className={styles.icon} />
                                <span className={styles.pulse}></span>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span 
                                        className={styles.text}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Chat with a Design Expert
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
