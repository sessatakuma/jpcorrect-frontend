export type FeedbackType = 'vocab' | 'grammar' | 'voice' | 'advance';

export interface Feedback {
    id: number;
    start: number;
    end: number;
    type: FeedbackType;
    highlight_part: string | null;
    comment: string;
    modify: string | null;
}

export interface TextSegment {
    text: string;
    highlight: boolean;
    feedback: Feedback | null;
}

export interface TranscriptItem {
    id: number;
    time: number;
    speaker_id: string;
    textSegments: TextSegment[];
}

export interface TranscriptData {
    date: string | null;
    practice_type: string | null;
    transcripts: TranscriptItem[];
    notes: string[];
}
