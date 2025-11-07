export async function sendPostRequest(url: string, body: unknown) {
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

        return await response.json();
    } 
    catch (error) {
        throw new Error(`Request failed: ${String(error)}`);
    }
}