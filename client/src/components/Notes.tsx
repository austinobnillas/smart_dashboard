"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Notes = () => {
    const { loggedIn } = useAuth();
    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [dummyNote, setDummyNote] = useState<{ title: string; content: string }[]>([]);

    const getDummyNotes = async () => {
        try {
        const res = await fetch("https://fakerapi.it/api/v2/texts?_quantity=10&_characters=50", {
            method: "GET",
        });

        if (!res.ok) throw new Error("User fetch failed");

        const data = await res.json();
        console.log(data.data);
        setDummyNote(data.data);
        } catch (err) {
        console.log("Error fetching user:", err);
        }
    };

    useEffect(() => {
        setShow(true);
        if (!loggedIn) {
        getDummyNotes();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted:", { title, note });
        setTitle("");
        setNote("");
        setShowForm(false);
    };

    return (
        <section
        className={`flex flex-col flex-1 m-5 lg:ml-0 p-5 bg-neutral-100 text-center border-3 border-gray-500 rounded-lg transition-opacity delay-900 duration-2000 ${
            show ? "opacity-100" : "opacity-0"
        }`}
        >
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold">Notes</h1>
            <button
            onClick={() => setShowForm(!showForm)}
            className="text-2xl font-bold px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
            +
            </button>
        </div>

        {/* Animated Form Container */}
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showForm ? "max-h-[500px] mt-4" : "max-h-0"
            }`}
        >
            <form onSubmit={handleSubmit} className="text-left space-y-3">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={4}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
                Submit
            </button>
            </form>
        </div>

        {/* Notes Display */}
        {!loggedIn && (
            <div className="flex-1 mt-5 overflow-y-auto max-h-[65vh] space-y-4 pr-2">
            {dummyNote.map((note, index) => (
                <div
                key={index}
                className="news-item bg-neutral-200 p-4 rounded flex items-center space-x-4"
                >
                <div className="news-text text-left flex-1">
                    <h2 className="font-semibold">{note.title}</h2>
                    <p>{note.content}</p>
                </div>
                </div>
            ))}
            </div>
        )}
        </section>
    );
    };

export default Notes;
