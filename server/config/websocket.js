const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const api_key = process.env.FINNHUB_API_KEY;

const symbols = ["AAPL", "TSLA", "GOOG"];

module.exports = {
    setupWebSocket: (wsPort) => {
        const wss = new WebSocketServer({ port: wsPort });
        wss.on("connection", (ws) => {
            console.log("Client connected");

            const interval = setInterval(() => {
                // Get current time via date()
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const seconds = now.getSeconds();
                const ampm = hours >= 12 ? "PM" : "AM";
                const formattedHours = hours % 12 || 12; // Convert 0 to 12

                const timeString = `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
                ws.send(`${timeString}`);
            }, 1000);

            ws.on("close", () => {
                console.log("Client disconnected");
                clearInterval(interval);
            });
        });

        console.log(`WebSocket Server Running on Port: ${wsPort}`);
    },

    setupStockWebSocket: (wsStockPort) => {
        const stockWss = new WebSocketServer({ port: wsStockPort });
        console.log(`📡 Stock WebSocket Server running on port: ${wsStockPort}`);
    
        const finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${api_key}`);
        let hasReceivedData = false;
    
        finnhubSocket.on("open", () => {
        console.log("✅ Connected to Finnhub WebSocket");
    
        // Subscribe to hardcoded symbols
        symbols.forEach((symbol, i) => {
            setTimeout(() => {
                finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
                console.log(`📩 Subscribed to ${symbol}`);
                }, i * 5000); // 2-second delay between each subscription
            });
    
        // Set a timeout to activate mock mode if no data received in 10 seconds
        setTimeout(() => {
            if (!hasReceivedData) {
            console.warn("⚠️ No data from Finnhub — entering mock mode.");
            startMockStream(stockWss);
            }
        }, 10000);
        });
    
        finnhubSocket.on("message", (data) => {
        hasReceivedData = true;
    
        const parsed = JSON.parse(data.toString());
        if (parsed.type === "trade") {
            console.log("📡 Real trade data:", parsed);
            stockWss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsed));
            }
            });
        }
        });
    
        stockWss.on("connection", (ws) => {
        console.log("✅ Client connected to stock WebSocket");
    
        ws.on("close", () => {
            console.log("❌ Stock client disconnected");
        });
        });
    
        finnhubSocket.on("close", () => {
        console.log("❌ Disconnected from Finnhub WebSocket");
        });
    
        finnhubSocket.on("error", (error) => {
        console.error("🚨 Finnhub WebSocket error:", error);
        });
    },
    };
    
    function startMockStream(server) {
    const mockInterval = setInterval(() => {
        symbols.forEach((symbol) => {
        const price = +(Math.random() * 1000).toFixed(2);
        const change = +(Math.random() * 10 - 5).toFixed(2); // -5% to +5%
    
        const mockTrade = {
            type: "trade",
            data: [
            {
                s: symbol,
                p: price,
                v: 1,
                t: Date.now(),
            },
            ],
            change,
            mock: true,
        };
    
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(mockTrade));
            }
        });
        });
    }, 2000); // Update every 2 seconds
    }

