export async function sendGetRequest<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Request failed: ${response.status} ${response.statusText} ${text}`);
        }

        return await response.json() as T;
    } catch (error) {
        throw new Error(`Request failed: ${String(error)}`);
    }
}

export async function sendPostRequest<T>(url: string, body: unknown): Promise<T> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Request failed: ${response.status} ${response.statusText} ${text}`);
        }

        return await response.json() as T;
    } 
    catch (error) {
        throw new Error(`Request failed: ${String(error)}`);
    }
}