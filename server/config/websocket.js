const { WebSocketServer } = require("ws");

module.exports = {
    setupWebSocket: (wsPort) => {
        const wss = new WebSocketServer({ port: wsPort });
        wss.on("connection", (ws) => {
            console.log("Client connected");
            
            const interval = setInterval(() => {
                //get current time via date()
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
                console.log("Client disconnected")
                clearInterval(interval);
            });
        });
        
        console.log(`WebSocket Server Running on Port: ${wsPort}`);
    } 
}

