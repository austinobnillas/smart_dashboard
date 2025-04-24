import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        console.log(username, password);

        const backendUrl = process.env.SMART_DASHBOARD_API_URL;

        if (!backendUrl) {
            console.error("Missing SMART_DASHBOARD_API_URL in environment");
            return NextResponse.json({ msg: "Server misconfiguration." }, { status: 500 });
        }

        // Make a request to the Express server
        const res = await fetch(`${backendUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Make sure cookies are included
            body: JSON.stringify({ username, pw: password }),
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                {
                    msg: error.msg || "Login failed",
                    errors: error.errors || [],
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log(data);

        // Manually forward any cookies from the backend to the client
        const cookies = res.headers.get("set-cookie");
        if (cookies) {
            return NextResponse.json(data, {
                status: 200,
                headers: {
                    "Set-Cookie": cookies, // Forward the Set-Cookie header from the backend
                },
            });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("Login route error:", error);
        return NextResponse.json(
            { msg: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
