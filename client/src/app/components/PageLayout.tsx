"use client";
import { time } from "console";
import { useEffect, useState } from "react";
import Header from "./Header";
import Section from "./Section";

export default function PageLayout() {
const [show, setShow] = useState(false);

useEffect(() => {
    setShow(true); // Trigger fade-in animation when component mounts
    


    if (typeof window !== "undefined" && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        },
        (error) => {
        console.log("Error getting location:", error);
        }
    );
    } else {
    console.log("Geolocation is not supported by this browser.");
    }
}, []);

return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <Section />
    </div>
    
);
}
