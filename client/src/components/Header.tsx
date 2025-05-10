"use client";
import Clock from "./Clock";
import { useRouter } from "next/navigation";
// import { logoutUser } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from 'react';

const Header = () => {
    const { loggedIn, user, setLoggedIn, setUser } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            localStorage.removeItem("userToken");
            setLoggedIn(false);
            setUser("");
            router.push("/");
            window.location.reload();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <header className="flex justify-between items-start sm:items-center p-5 m-5 mb-0 rounded-xl border-3 border-gray-500 bg-neutral-100 text-black gap-2 flex-wrap">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">Hello, {loggedIn ? user : "Guest"}</h1>
                <Clock />
            </div>

            <button
                onClick={loggedIn ? handleLogout : handleLogin}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
                {loggedIn ? "Logout" : "Log in"}
            </button>
        </header>


    );
};

export default Header;