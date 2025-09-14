export async function fetchFurigana(text) {
    const res = await fetch("/api/parse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if (!res.ok) {
        throw new Error("API request failed");
    }

    const json = await res.json();
    return json.result;
}