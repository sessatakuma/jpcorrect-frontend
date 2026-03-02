import React, { useState, useEffect, type MouseEvent } from 'react';

import Display from 'components/Display';
import Nav from 'components/Nav';
import RightPanel from 'components/RightPanel';
import useTranscript from 'hook/useTranscript';

import type { Feedback } from 'src/types/transcript';

import 'components/Main.css';

export default function Main() {
    const [currentTime, setCurrentTime] = useState(0);

    const [mode, setMode] = useState<'discuss' | 'review'>('discuss');
    const isReviewMode = mode === 'review';

    const { transcripts, notes, updateNote, selectedCaptionIndex, setSelectedCaptionIndex } =
        useTranscript(currentTime);

    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'review' || modeParam === 'discuss') {
            setMode(modeParam);
        }
    }, []);

    const handleNoteChange = (newNote: string) => {
        if (selectedCaptionIndex !== -1) {
            updateNote(selectedCaptionIndex, newNote);
        }
    };

    const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
        const targetElement = e.target as HTMLElement;
        if (targetElement.tagName === 'MAIN' || e.currentTarget === e.target) {
            setSelectedCaptionIndex(-1);
            setFeedback(null);
        }
    };

    return (
        <div className='main-wrapper' onClick={handleBackgroundClick}>
            <Nav isReviewMode={isReviewMode} />
            <main>
                <Display
                    transcripts={transcripts}
                    selectedCaptionIndex={selectedCaptionIndex}
                    setSelectedCaptionIndex={setSelectedCaptionIndex}
                    setFeedback={setFeedback}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    isReviewMode={isReviewMode}
                />
                <RightPanel
                    notes={notes}
                    selectedCaptionIndex={selectedCaptionIndex}
                    onNoteChange={handleNoteChange}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    transcripts={transcripts}
                />
            </main>
        </div>
    );
}
