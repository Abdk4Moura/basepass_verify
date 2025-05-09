"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, storeToken, removeToken, getToken } from '@/lib/api';
import { User, Token } from '@/schemas';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading until initial check is done
    const router = useRouter();

    // Fetch user data based on token
    const fetchUser = useCallback(async () => {
        const currentToken = getToken();
        if (currentToken) {
            setToken(currentToken); // Set token state
            try {
                // console.log("AuthProvider: Fetching user data...");
                const userData = await apiRequest<User>('/users/me', { method: 'GET' });
                setUser(userData);
                // console.log("AuthProvider: User data fetched:", userData);
            } catch (error: any) {
                console.error("AuthProvider: Failed to fetch user:", error);
                // If token is invalid (e.g., 401), log out
                if (error.status === 401 || error.status === 403) {
                    logout(); // Use the logout function to clear state and token
                } else {
                    // Handle other potential errors (e.g., network error)
                    setUser(null); // Clear user data on other errors too
                }
            }
        } else {
            // No token found
            setUser(null);
        }
        setIsLoading(false); // Finished loading attempt
    }, []); // Removed router dependency as logout handles it

    // Check auth status on initial load
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const tokenData = await apiRequest<Token>('/login/access-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
                needsAuth: false, // Login endpoint doesn't require auth
            });

            storeToken(tokenData.access_token);
            setToken(tokenData.access_token);
            await fetchUser(); // Fetch user data immediately after successful login
            // Redirect happens based on role fetched in fetchUser or on the login page itself
            // console.log("AuthProvider: Login successful");

        } catch (error) {
            console.error("AuthProvider: Login failed:", error);
            setToken(null);
            setUser(null);
            setIsLoading(false);
            throw error; // Re-throw error for the login page to handle
        }
        // setIsLoading(false); // Loading state set in fetchUser
    };

    const logout = () => {
        // console.log("AuthProvider: Logging out");
        removeToken();
        setToken(null);
        setUser(null);
        // Redirect to login page
        if (typeof window !== 'undefined') {
            // Avoid using router here if it causes issues during logout/redirect loops
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user && !!token, user, token, isLoading, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};