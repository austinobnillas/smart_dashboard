import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params; // Access the dynamic 'id' from params
        const parsedId = parseInt(id, 10);

        if (isNaN(parsedId)) {
            console.log("err");
        }

        console.log("ID:", parsedId);

        if (!id) {
            return NextResponse.json({ msg: "Note ID is required." }, { status: 400 });
        }

        // You can access the request body if needed, depending on how your request is structured

        const backendUrl = process.env.SMART_DASHBOARD_API_URL;

        if (!backendUrl) {
            console.error("Missing SMART_DASHBOARD_API_URL in environment");
            return NextResponse.json({ msg: "Server misconfiguration." }, { status: 500 });
        }

        // Get the cookie from the incoming request (if necessary)
        const cookie = req.headers.get("cookie");

        // Forward the request to the Express backend with the note `id` in the URL
        const expressRes = await fetch(`${backendUrl}/api/deletenote/${parsedId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(cookie && { Cookie: cookie }), // Only add cookie if exists
            }
        });

        if (!expressRes.ok) {
            const error = await expressRes.json();
            return NextResponse.json({
                msg: error.msg || "Delete Note failed",
                errors: error.errors || [],
            }, { status: expressRes.status });
        }

        const data = await expressRes.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("Delete note route error:", error);
        return NextResponse.json({ msg: "Internal server error", error: error.message }, { status: 500 });
    }
}
