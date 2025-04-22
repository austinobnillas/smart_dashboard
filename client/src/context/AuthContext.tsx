"use client";
import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
    loggedIn: boolean;
    user: string;
    setLoggedIn: (value: boolean) => void;
    setUser: (value: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState("");

    return (
        <AuthContext.Provider value={{ loggedIn, user, setLoggedIn, setUser }}>
        {children}
        </AuthContext.Provider>
    );
    };

    // Helper hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};