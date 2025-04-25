"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
    loggedIn: boolean;
    user: string | null;
    loading: boolean;
    setLoggedIn: (value: boolean) => void;
    setUser: (value: string | null) => void;
    setLoading: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/getUser", {
                    credentials: "include", // include cookies
                });

                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                console.log("Authenticated user:", data.username);
                setUser(data.username);
                setLoggedIn(true);
            } catch (err) {
                setUser(null);
                setLoggedIn(false);
            } finally {
                setLoading(false); // Always set loading to false when done
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, user, loading, setLoggedIn, setUser, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
