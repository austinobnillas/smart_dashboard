const api_key = process.env.FINNHUB_API_KEY

type MessageCallback = (data: any) => void;


export const getStockData = (
    symbols: string[],
    onMessage: MessageCallback
    ): (() => void) => {
    const socket = new WebSocket(
        `wss://ws.finnhub.io?token=${api_key}`
    );

    socket.addEventListener("open", () => {
        symbols.forEach((symbol) => {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
        });
    });

    socket.addEventListener("message", (event) => {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
    });

    socket.addEventListener("error", (err) => {
        console.log("WebSocket error:", err);
    });

    socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
    });

    // Return a cleanup function
    return () => {
        socket.close();
    };
    };

