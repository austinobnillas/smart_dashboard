"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Notes = () => {
    const { user, loggedIn, loading } = useAuth();
    // console.log("Current user:", user);
    
    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState<{ id: number; title: string; note: string; content: string; }[]>([]);

    // Fetch dummy notes from an API
    const getDummyNotes = async () => {
        try {
            const res = await fetch("https://fakerapi.it/api/v2/texts?_quantity=10&_characters=50", {
                method: "GET",
            });

            if (!res.ok) throw new Error("Dummy notes fetch failed");

            const data = await res.json();
            console.log("Dummy Notes:", data.data);
            setNotes(data.data);
        } catch (err) {
            console.log("Error fetching dummy notes:", err);
        }
    };

    // Fetch user notes from the API
    const getUserNotes = async () => {
        try {
            const res = await fetch("/api/getNotes", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("User notes fetch failed");

            const data = await res.json();
            console.log("User Notes:", data);
            setNotes(data);
        } catch (err) {
            console.log("Error fetching user notes:", err);
        }
    };

    // Effect to handle note fetching based on login status
    useEffect(() => {
        if (loading) return; // Wait until the authentication check finishes

        setShow(true); // Show the section after loading completes
        setNotes([]); // Clear existing notes

        if (user) {
            getUserNotes(); // Fetch user notes if logged in
        } else {
            getDummyNotes(); // Fetch dummy notes if not logged in
        }
    }, [loading, user]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted:", { title, note });
        try {
            const res = await fetch("/api/addNote", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ title, note }),
            })
            if (!res.ok) {
                const errorData = await res.json();
                console.log("Add note error:", errorData);
                return;
            }
            const data = await res.json();
            console.log("this note was just added:", data)
            setNotes(prevNotes => [...prevNotes, data ]);
        }
        catch (err) {
            console.log(err)
        }
        setTitle(""); // Reset title field
        setNote("");  // Reset note field
        setShowForm(false); // Hide the form after submission
    };
    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/deleteNote/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete note");
            }

            // Remove the deleted note from the state by filtering out the note with the matching id
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        } catch (err) {
            console.log("Error deleting note:", err);
        }
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
                    onClick={() => {if(loggedIn) {setShowForm(!showForm)}}}
                    className="text-2xl font-bold px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                    +
                </button>
            </div>
            {notes.length > 0 && "content" in notes[0] && (
            <p className="text-yellow-600 text-sm font-medium mb-2">
                Log in to write your own notes
            </p>
            )}

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

            <div className="flex-1 mt-5 overflow-y-auto max-h-[100vh] space-y-4 pr-2">
                {notes.map((note, index) => (
                    <div
                        key={index}
                        className="group news-item bg-neutral-200 p-4 rounded flex items-center space-x-4 justify-between"
                    >
                        <div className="news-text text-left flex-1">
                            <h2 className="font-semibold">{note.title}</h2>
                            {note.note ? <p>{note.note}</p> : <p>{note.content}</p>}
                        </div>
                        <button
                            onClick={() => handleDelete(note.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 font-bold text-lg"
                            title="Delete note"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Notes;
