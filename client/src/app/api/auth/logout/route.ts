import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const backendUrl = process.env.SMART_DASHBOARD_API_URL;

    try {
        await fetch(`${backendUrl}/api/logout`, {
            method: "POST",
            credentials: "include", // Important to include cookies
        });

        // Clear the cookie on the client side by setting it to expire immediately
        const response = NextResponse.json({ msg: "Logged out successfully" });
        response.cookies.set('userToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/', // match the path of the original cookie
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ msg: "Logout failed"}, { status: 500 });
    }
}
