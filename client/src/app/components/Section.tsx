"use client"
import { useEffect, useState } from "react";

const Section = () => {
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
        <main className="flex flex-1 justify-between p-5 gap-5">
            <section 
            className={`flex-1 p-5 bg-green-200 text-center border border-gray-300 rounded-lg transition-opacity delay-300 duration-2000
            ${show ? "opacity-100" : "opacity-0"
            }`}>
        
            </section>
            <section className={`flex-1 p-5 bg-red-200 text-center border border-gray-300 rounded-lg transition-opacity delay-600 duration-2000
            ${show ? "opacity-100" : "opacity-0"
            }`}>Section 2</section>
            <section className={`flex-1 p-5 bg-blue-200 text-center border border-gray-300 rounded-lg transition-opacity delay-900 duration-2000
            ${show ? "opacity-100" : "opacity-0"
            }`}>Section 3</section>
        </main>
    )
}
export default Section;