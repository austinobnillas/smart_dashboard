"use client"
import { useEffect, useState } from "react";

const Stocks = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true); // Trigger fade-in animation when component mounts
    }, []);
    return (
        <div className="w-full flex flex-col items-center justify-center p-5 md:pl-0 pb-0">
    <section
        className={`w-full h-full bg-neutral-100 to-neutral-100 text-black text-center border-3 border-gray-500 rounded-2xl shadow-lg p-8 transition-opacity duration-1000 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
        }`}
        
    >
        <h1 className="text-xl font-bold">Stocks</h1>
    </section>
    </div>
    )
}
export default Stocks;