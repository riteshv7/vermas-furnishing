'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });
    const cursorY = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });

    useEffect(() => {
        // Only show on desktop devices that support hover
        if (window.matchMedia("(any-hover: hover)").matches) {
            setIsVisible(true);
        }

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={styles.cursorContainer}>
            <motion.div
                className={styles.cursor}
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />
        </div>
    );
}

// Wrapper component to make any element "Magnetic"
export function Magnetic({ children }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const mouseMove = (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const mouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={mouseMove}
            onMouseLeave={mouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            style={{ display: 'inline-block' }}
        >
            {children}
        </motion.div>
    );
}
