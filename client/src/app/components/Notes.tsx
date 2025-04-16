"use client"
import { useEffect, useState } from "react";

const Section = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true); // Trigger fade-in animation when component mounts
    }, []);
    return (
        <section className={`flex-1 m-5 md:ml-0 p-5 bg-neutral-100 text-center border-3 border-gray-500 rounded-lg transition-opacity delay-900 duration-2000
            ${show ? "opacity-100" : "opacity-0"
            }`}>
                <h1 className="text-xl font-bold">Notes</h1>
        </section>
        
    )
}
export default Section;