"use client";
import { useRouter } from "next/navigation";
// import { logoutUser } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from 'react';

const Header = () => {
    const [time, setTime] = useState("...");
    const { loggedIn, user, setLoggedIn, setUser } = useAuth();
    const router = useRouter();
    const getUsername = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/getUser", {
            method: "GET",
            credentials: "include",
            });

            if (!res.ok) throw new Error("User fetch failed");

            const data = await res.json();
            console.log(data)
            setUser(data.username || "Guest");
            setLoggedIn(true);
        } catch (err) {
            console.log("Error fetching user:", err);
            setLoggedIn(false);
            setUser("");
        }
        };

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

    useEffect(() => {
        // getUsername();

        const socket = new WebSocket("ws://localhost:8001");
        socket.onopen = () => console.log("Connected to WebSocket");
        socket.onmessage = (event) => setTime(event.data);
        socket.onclose = () => console.log("Disconnected from WebSocket");

        return () => socket.close();
    }, []);

    return (
        <header className="flex justify-between items-center p-5 m-5 mb-0 rounded-xl border-3 border-gray-500 bg-neutral-100 text-black">
        <h1 className="text-xl font-bold">Hello, {loggedIn ? user : "Guest"}</h1>
        <div className="flex items-center gap-4">
            <p className="font-mono">{time}</p>
            {loggedIn ? (
            <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
                Logout
            </button>
            ) : (
            <button
                onClick={handleLogin}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
                Log in
            </button>
            )}
        </div>
        </header>
    );
};

export default Header;