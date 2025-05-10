"use client"
import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState("Loading ...");

    useEffect(() => {
        const interval = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;

        const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;

        setTime(formattedTime);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <p className="font-mono text-sm">{time}</p>;
    }
