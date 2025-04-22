const express = require("express");
const http = require("http");
const database = require("./config/database");

const cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");

require("dotenv").config();

const port = process.env.SERVER_PORT;
const wsPort = process.env.WS_PORT;
const wsStockPort = process.env.WS_STOCK_PORT 
const setupWebSocket = require("./config/websocket");
const setupStockWebSocket = require("./config/websocket");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.BD_ORIGIN, credentials: true }));


require("./routes/routes")(app);



app.listen(port, () => {
    console.log(`Server Running! Port:`, port)
})

//web socket 
const server = http.createServer(app);
setupWebSocket.setupWebSocket(wsPort); 
setupStockWebSocket.setupStockWebSocket(wsStockPort); 