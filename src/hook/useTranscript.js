const data = require('data/transcript.json');

export default function getCaptionData() {
    if (!data) {
        return [];
    }

    const date = data.date.replace(/[^0-9]/g, '/') || null;
    const practice_type = data.practice_type || null;

    const transcripts = data.transcripts.map((transcript) => {
        // Gather feedbacks for this transcript that have highlight_part
        const feedbacks = (transcript.feedback_ids || []).map((id) => data.feedbacks[id]);
        // Prepare highlights: find all highlight_part substrings and their indices
        let highlights = [];
        feedbacks.forEach((fb) => {
            if (fb && fb.highlight_part) {
                const part = fb.highlight_part;
                let fromIndex = 0;
                // To avoid overlapping highlights, only mark the first occurrence of each highlight_part
                // If multiple feedbacks highlight the same part, allow all (but mark their feedbackId)
                let idx = transcript.text.indexOf(part, fromIndex);
                while (idx !== -1) {
                    // Check if this range already overlaps any previous highlight
                    const overlap = highlights.some(
                        (h) => idx < h.end && idx + part.length > h.start,
                    );
                    if (!overlap) {
                        highlights.push({
                            start: idx,
                            end: idx + part.length,
                            feedbackId: fb.id,
                        });
                        break; // Only highlight first occurrence for this feedback
                    }
                    fromIndex = idx + 1;
                    idx = transcript.text.indexOf(part, fromIndex);
                }
            }
        });
        // Sort highlights by start index
        highlights.sort((a, b) => a.start - b.start);

        // Build segments
        let segments = [];
        let lastIdx = 0;
        for (let i = 0; i < highlights.length; ++i) {
            const h = highlights[i];
            if (lastIdx < h.start) {
                segments.push({
                    text: transcript.text.slice(lastIdx, h.start),
                    highlight: false,
                    feedback: null,
                });
            }
            // Find the feedback matching this highlight
            const matchingFeedback = feedbacks.find((fb) => fb.id === h.feedbackId);
            segments.push({
                text: transcript.text.slice(h.start, h.end),
                highlight: true,
                feedback: matchingFeedback ?? null,
            });
            lastIdx = h.end;
        }
        if (lastIdx < transcript.text.length) {
            segments.push({
                text: transcript.text.slice(lastIdx),
                highlight: false,
                feedback: null,
            });
        }

        return {
            time: transcript.start,
            textSegments: segments,
        };
    });
    //
    return {
        date, 
        practice_type, 
        transcripts
    };
}
