// src/app/api/test/[id]/route.ts (App Router API route)
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    return new Response(JSON.stringify({ msg: `Received ID: ${id}` }), {
    status: 200,
    headers: {
        "Content-Type": "application/json"
    }
    });
}
