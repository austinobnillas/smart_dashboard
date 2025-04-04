const express = require("express");
const { WebSocketServer } = require("ws");

const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.DB_PORT;
const wsPort = 8001;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.DB_ORIGIN, credentials: true }));



// Handle HTTP to WebSocket Upgrade

const wss = new WebSocketServer({ port: wsPort });

wss.on("connection", (ws) => {
    console.log("Client connected");
    
    const interval = setInterval(() => {
        
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
//require config and routes
// require("./config/mongoose.config");
// require("./routes/communityPCs.routes")(app);

app.get('/api/test', (req, res) => {
    console.log("test")
    res.json({test: "test"})
} )

app.listen(port, () => {
    console.log(`Server Running! Port:`, port)
})

