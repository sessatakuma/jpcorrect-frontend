import { useState, useEffect } from 'react';

const data = require('data/transcript.json');

function processTranscriptData() {
    if (!data) {
        return {
            date: null,
            practice_type: null,
            transcripts: [],
            notes: [],
        };
    }

    const date = data.date.replace(/[^0-9]/g, '/') || null;
    const practice_type = data.practice_type || null;
    const notes = data.transcripts.map(() => ''); // Initialize notes for each transcript

    const transcripts = data.transcripts.map((transcript, index) => {
        const feedbacks = (transcript.feedback_ids || []).map((id) => data.feedbacks[id]);
        let highlights = [];
        feedbacks.forEach((fb) => {
            if (fb && fb.highlight_part) {
                const part = fb.highlight_part;
                let fromIndex = 0;
                let idx = transcript.text.indexOf(part, fromIndex);
                while (idx !== -1) {
                    const overlap = highlights.some(
                        (h) => idx < h.end && idx + part.length > h.start,
                    );
                    if (!overlap) {
                        highlights.push({
                            start: idx,
                            end: idx + part.length,
                            feedbackId: fb.id,
                        });
                        break; 
                    }
                    fromIndex = idx + 1;
                    idx = transcript.text.indexOf(part, fromIndex);
                }
            }
        });
        highlights.sort((a, b) => a.start - b.start);

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
            id: index,
            time: transcript.start,
            textSegments: segments,
        };
    });
    
    return {
        date, 
        practice_type, 
        transcripts,
        notes,
    };
}


export default function useTranscriptData() {
    const [transcriptData, setTranscriptData] = useState({
        date: null,
        practice_type: null,
        transcripts: [],
        notes: [],
    });

    useEffect(() => {
        setTranscriptData(processTranscriptData());
    }, []);

    const updateNote = (index, newText) => {
        setTranscriptData(prevData => {
            const newNotes = [...prevData.notes];
            newNotes[index] = newText;
            return {
                ...prevData,
                notes: newNotes,
            };
        });
    };

    return { ...transcriptData, updateNote };
}
