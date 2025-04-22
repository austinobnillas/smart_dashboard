const BASE_URL = process.env.SMART_DASHBOARD_API_KEY;

export async function registerUser(username: string, pw: string) {
    const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, pw }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error)
        throw {
            message: error.msg || `${error.msg}`,
            errors: error.errors || [],
        };
    }
    return res.json();
}

export async function loginUser(username: string, pw: string) {
    const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, pw }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw {
            message: error.msg || `${error.msg}`,
            errors: error.errors || [],
        };
    }

    return res.json();
}

export async function logoutUser() {
    await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
    });
}
export async function getUser() {
    try {
        const res = await fetch(`${BASE_URL}/api/getUser`, {
            method: "GET",
            credentials: "include"
        });

        if (!res.ok) {
            console.log(res)
            throw (`Failed to fetch user: ${res.status}`);
        }

        const data = await res.json(); // parse JSON
        return data; // e.g., { username: "Austin" }
    } catch (error) {
        console.error("Error in getUser:", error);
        return null;
    }
}