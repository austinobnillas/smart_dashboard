"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { registerUser } from '@/lib/authService';
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
    const { loggedIn, user, setLoggedIn, setUser } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setValidationErrors([]);
        if (!username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw {
                    message: data.msg || "Login failed",
                    errors: data.errors || [],
                };
            }

            setUser(username);
            setLoggedIn(true);
            router.push("/");
        } catch (err: any) {
            console.log("THIS", err);
            setError(err.message || "Registration failed.");
            setValidationErrors(err.errors || []);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto p-6 bg-neutral-100 rounded-lg border-2 border-gray-500 shadow space-y-4"
        >
            <h1 className='text-2xl text-center font-bold text-gray-800'>Register</h1>

            {error && (
                <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded text-sm">
                    {error}
                </div>
            )}

            {validationErrors.length > 0 && (
                <ul className="text-red-600 bg-red-50 border border-red-300 p-2 rounded text-sm list-disc list-inside space-y-1">
                    {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            )}

            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition"
                >
                    Register
                </button>
            </div>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a className="text-gray-800 font-medium underline hover:text-gray-600" href="/login">
                    Login here
                </a>
                {" "}|{" "}
                <a className="text-gray-800 font-medium underline hover:text-gray-600" href="/">
                        Dashboard
                </a>
            </p>
        </form>
    );
}
