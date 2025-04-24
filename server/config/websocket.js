const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const api_key = process.env.FINNHUB_API_KEY;

const symbols = ["AAPL", "TSLA", "GOOG"];

let mockMode = false;
let mockInterval = null;

module.exports = {
    setupWebSocket: (wsPort) => {
        const wss = new WebSocketServer({ port: wsPort });
        wss.on("connection", (ws) => {
        console.log("Client connected");

        const interval = setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const timeString = `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
            ws.send(`${timeString}`);
        }, 1000);

        ws.on("close", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });
        });

        console.log(`🕓 WebSocket Server Running on Port: ${wsPort}`);
    },

    setupStockWebSocket: (wsStockPort) => {
        const stockWss = new WebSocketServer({ port: wsStockPort });
        console.log(`📡 Stock WebSocket Server running on port: ${wsStockPort}`);
    
        const finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${api_key}`);
        let hasReceivedRealTrade = false;
    
        finnhubSocket.on("open", () => {
            console.log("✅ Connected to Finnhub WebSocket");
        
            // Subscribe to symbols
            symbols.forEach((symbol, i) => {
                setTimeout(() => {
                finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
                console.log(`📩 Subscribed to ${symbol}`);
                }, i * 5000);
            });
        
            // Start timeout: wait 10s for real trade data
            setTimeout(() => {
                if (!hasReceivedRealTrade) {
                console.warn("⚠️ No trade data received — entering mock mode.");
                startMockStream(stockWss);
                }
            }, 10000);
            });
        
            finnhubSocket.on("message", (data) => {
            const parsed = JSON.parse(data.toString());
        
            if (parsed.type === "trade" && parsed.data && parsed.data.length > 0) {
                if (!hasReceivedRealTrade) {
                hasReceivedRealTrade = true;
                console.log("✅ Real trade data received — exiting mock mode if active.");
                stopMockStream();
                }
        
                // console.log("📡 Real trade data:", parsed);
        
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
        if (mockMode) return;
        
        mockMode = true;
        console.log("🔄 Starting mock stream...");
        
        mockInterval = setInterval(() => {
            symbols.forEach((symbol) => {
            const price = +(Math.random() * 1000).toFixed(2);
            const change = +(Math.random() * 10 - 5).toFixed(2);
        
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
        }, 2000);
    }
    
    function stopMockStream() {
    if (mockInterval) {
        clearInterval(mockInterval);
        mockInterval = null;
        mockMode = false;
        console.log("🛑 Stopped mock stream");
    }
}
