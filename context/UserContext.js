"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [wishlist, setWishlist] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load - Check localStorage for phone number to auto-login
    useEffect(() => {
        const storedPhone = localStorage.getItem("user_phone");
        if (storedPhone) {
            fetchUser(storedPhone);
        } else {
            // Load anonymous wishlist
            const storedWishlist = localStorage.getItem("wishlist");
            if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
            setIsLoaded(true);
        }
    }, []);

    const fetchUser = async (phone) => {
        try {
            const res = await fetch(`/api/user?phone=${phone}`);
            const data = await res.json();
            if (data.success) {
                setUser({
                    name: data.user.name || '',
                    phone: data.user.phone,
                    email: data.user.email || ''
                });
                setWishlist(data.user.wishlist || []);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
        } finally {
            setIsLoaded(true);
        }
    };

    const saveUser = async (userData) => {
        // Optimistic update
        setUser(prev => ({ ...prev, ...userData }));

        if (userData.phone) {
            localStorage.setItem("user_phone", userData.phone);
        }

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...user,
                    ...userData,
                    wishlist // Sync current wishlist
                }),
            });
            const data = await res.json();
            if (data.success && data.user) {
                setUser({
                    name: data.user.name || '',
                    phone: data.user.phone,
                    email: data.user.email || ''
                });
                setWishlist(data.user.wishlist || []);
            }
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    // Wishlist Logic
    const addToWishlist = (product) => {
        const newItem = { id: product.id, name: product.name, image: product.image };
        const newWishlist = [...wishlist, newItem];

        // Avoid duplicates
        if (wishlist.some(item => item.id === product.id)) return;

        setWishlist(newWishlist);
        syncWishlist(newWishlist);
    };

    const removeFromWishlist = (productId) => {
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        syncWishlist(newWishlist);
    };

    const toggleWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    const syncWishlist = useCallback(async (newWishlist) => {
        // Always save to localStorage
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));

        // If user is logged in, sync to DB
        if (user.phone) {
            try {
                await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: user.phone,
                        wishlist: newWishlist
                    }),
                });
            } catch (error) {
                console.error("Failed to sync wishlist", error);
            }
        }
    }, [user.phone]);

    return (
        <UserContext.Provider
            value={{
                user,
                wishlist,
                saveUser,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                isLoaded,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
