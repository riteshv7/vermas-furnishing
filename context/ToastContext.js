'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from '../components/Toast.module.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title, message, image, duration = 4000 }) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, title, message, image };

        setToasts((prev) => [...prev, newToast]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className={styles.toastContainer}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className={styles.toast}
                        >
                            {toast.image && (
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={toast.image}
                                        alt={toast.title}
                                        fill
                                        sizes="60px"
                                        className={styles.image}
                                    />
                                </div>
                            )}
                            <div className={styles.content}>
                                <p className={styles.title}>{toast.title}</p>
                                <p className={styles.message}>{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className={styles.closeBtn}
                                aria-label="Close notification"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
