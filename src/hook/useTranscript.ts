import { useState, useEffect, useMemo } from 'react';

import data from 'data/transcript.json';

import type { Feedback, TranscriptData, TranscriptItem, TextSegment } from 'src/types/transcript';

interface RawTranscript {
    start: number;
    text: string;
    speaker_id: string;
    feedback_ids?: number[];
}

interface RawTranscriptData {
    date: string;
    practice_type: string;
    transcripts: RawTranscript[];
    feedbacks: Feedback[];
}

interface HighlightMatch {
    start: number;
    end: number;
    feedbackId: number;
}

function processTranscriptData(rawData: RawTranscriptData): TranscriptData {
    if (!rawData) {
        return {
            date: null,
            practice_type: null,
            transcripts: [],
            notes: [],
        };
    }

    const date = rawData.date.replace(/[^0-9]/g, '/') || null;
    const practice_type = rawData.practice_type || null;

    const notes = rawData.transcripts.map(() => '');

    const transcripts: TranscriptItem[] = rawData.transcripts.map((transcript, index) => {
        const feedbacks = (transcript.feedback_ids || []).map((id) => rawData.feedbacks[id]);
        const highlights: HighlightMatch[] = [];

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

        const segments: TextSegment[] = [];
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
            const matchingFeedback = feedbacks.find((fb) => fb?.id === h.feedbackId);
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
            speaker_id: transcript.speaker_id,
        };
    });

    return { date, practice_type, transcripts, notes };
}

export default function useTranscript(currentTime: number) {
    const initialData = useMemo(() => processTranscriptData(data as RawTranscriptData), []);

    const [transcriptData, setTranscriptData] = useState(initialData);
    const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(-1);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

    useEffect(() => {
        let index = -1;
        const list = transcriptData.transcripts;

        for (let i = 0; i < list.length; i++) {
            if (currentTime >= list[i].time) {
                index = i;
            } else {
                break;
            }
        }

        if (index !== -1 && index !== currentCaptionIndex) {
            setCurrentCaptionIndex(index);
        }
    }, [currentTime, transcriptData.transcripts, currentCaptionIndex]);

    const updateNote = (index: number, newText: string) => {
        setTranscriptData((prevData) => {
            const newNotes = [...prevData.notes];
            newNotes[index] = newText;
            return {
                ...prevData,
                notes: newNotes,
            };
        });
    };

    return {
        ...transcriptData,
        currentCaptionIndex,
        selectedCaptionIndex,
        setSelectedCaptionIndex,
        updateNote,
    };
}
