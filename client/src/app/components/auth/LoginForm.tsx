"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
    const router = useRouter();

    return (
        <form className="w-screen max-w-md mx-8 p-6 bg-gray-800 rounded-lg shadow-md space-y-4">
            <h1 className='text-2xl text-center'>Login</h1>
            <div>
                <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Login
                </button>
            </div>
            <p className="text-center text-sm text-gray-300">Don't have an account? <a className="text-blue-400 hover:underline"href="">Sign Up Here</a>
            </p>
        </form>
    );
}