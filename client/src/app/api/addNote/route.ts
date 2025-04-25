import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { title, note } = await req.json();
        const backendUrl = process.env.SMART_DASHBOARD_API_URL;

        if (!backendUrl) {
            console.error("Missing SMART_DASHBOARD_API_URL in environment");
            return NextResponse.json({ msg: "Server misconfiguration." }, { status: 500 });
        }

        // Get the cookie from the incoming request
        const cookie = req.headers.get("cookie");

        // Forward request to Express backend with cookie
        const res = await fetch(`${backendUrl}/api/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookie && { Cookie: cookie }), // Only add if cookie exists
            },
            body: JSON.stringify({ title, note }),
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                {
                    msg: error.msg || "Add Note failed",
                    errors: error.errors || [],
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log("new data:", data)
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("Add note route error:", error);
        return NextResponse.json(
            { msg: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
