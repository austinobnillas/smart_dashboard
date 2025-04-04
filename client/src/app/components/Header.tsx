"use client"
import { useState, useEffect } from "react"

const Header = () => {
    const [time, setTime] = useState<string>("Waiting for time...");
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8001");
    
        socket.onopen = () => console.log("Connected to WebSocket");
        socket.onmessage = (event) => {
            setTime(event.data); // Update the time every second
        };
        socket.onclose = () => console.log("Disconnected from WebSocket");
    
        setWs(socket);
        return () => socket.close();
    }, []);

    return (
        <header className="flex justify-between items-center p-5 m-5 mb-0 rounded-xl  bg-gray-800 text-white">
            <h1>Hello, Name</h1>
            <div>
            <p>{time}</p>
            <button className="btn">Logout</button>
            </div>
        </header>
    )
}
export default Header;