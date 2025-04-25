"use client";
import { useEffect, useState } from "react";

interface StockData {
price: number | null;
change: number | null;
}

interface StocksState {
[symbol: string]: StockData;
}

interface FinnhubTrade {
    s: string; // Symbol
    p: number; // Price
    t: number; // Timestamp
    v: number; // Volume
}

const Stocks = () => {
const [show, setShow] = useState(false);
const [isMock, setIsMock] = useState(false);
const [stocks, setStocks] = useState<StocksState>({
    AAPL: { price: null, change: null },
    TSLA: { price: null, change: null },
    GOOG: { price: null, change: null },
});

useEffect(() => {
    setShow(true);
    const socket = new WebSocket("ws://localhost:8002");

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            // console.log("📨 Message from WebSocket server:", message);

            if (message.mock) {
                setIsMock(true); // <- set mock mode
                }
        
            if (message.type === "trade" && Array.isArray(message.data)) {
                message.data.forEach((trade: any) => {
                const { s, p } = trade;
                const change = message.change || 0;
        
                setStocks((prev) => ({
                    ...prev,
                    [s]: {
                    price: p,
                    change,
                    },
                }));
                });
            }
            } catch (err) {
            console.error("❌ Error parsing message:", err);
            }
        };

    socket.onerror = (err) => console.log("WebSocket error:", err);
    socket.onclose = () => console.log("WebSocket closed");

    return () => socket.close();
}, []);

return (
    <div className="w-full flex flex-col items-center justify-center p-5 md:pl-0 pb-0">
    <section
        className={`w-full h-full bg-neutral-100 text-black text-center border-3 border-gray-500 rounded-2xl shadow-lg p-8 transition-opacity duration-1000 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
        }`}
    >
        <h1 className="text-xl font-bold mb-4">📈 Live Stock Data</h1>
        {isMock && (
            <div className="text-yellow-600 text-sm font-medium mb-2">
                📊 Displaying Dummy Data (Market Closed)
            </div>
        )}

        {Object.keys(stocks).every((key) => stocks[key].price === null) ? (
        <p className="text-gray-500">Waiting for live stock updates...</p>
        ) : (
        <div className="space-y-4">
            {Object.entries(stocks).map(([symbol, data]) => (
            <div
                key={symbol}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4"
            >
                <div className="flex-1 text-left">
                <h2 className="font-semibold text-lg">{symbol}</h2>
                <p className="text-sm text-gray-600">
                    Current Price:{" "}
                    {data.price !== null ? `$${data.price.toFixed(2)}` : "—"}
                </p>
                </div>
                <div
                className={`text-lg font-semibold ${
                    data.change && data.change >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
                >
                {data.change !== null
                    ? `${data.change >= 0 ? "+" : ""}${data.change.toFixed(2)}%`
                    : ""}
                </div>
            </div>
            ))}
        </div>
        )}
    </section>
    </div>
);
};

export default Stocks;
