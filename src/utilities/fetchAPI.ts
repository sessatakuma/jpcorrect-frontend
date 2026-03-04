interface ParseResponse {
    result: string;
}

export async function fetchFurigana(text: string): Promise<string> {
    const res = await fetch('/api/parse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        throw new Error('API request failed');
    }

    const json = (await res.json()) as ParseResponse;
    return json.result;
}
