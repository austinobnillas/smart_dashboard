const express = require("express");
const http = require("http");

const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.DB_PORT;
const wsPort = 8001;

const setupWebSocket = require("./config/websocket");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.DB_ORIGIN, credentials: true }));



// Handle HTTP to WebSocket Upgrade

//require config and routes
// require("./config/mongoose.config");
// require("./routes/communityPCs.routes")(app);

app.get('/api/test', (req, res) => {
    console.log("test")
    res.json({test: "test"})
} )

const server = http.createServer(app);

setupWebSocket.setupWebSocket(wsPort); 

app.listen(port, () => {
    console.log(`Server Running! Port:`, port)
})

