import React, { useState, useEffect } from 'react';

import Display from 'components/Display';
import Nav from 'components/Nav';
import RightPanel from 'components/RightPanel';
import useTranscript from 'hook/useTranscript';

import 'components/Main.css';

export default function Main() {
    const [currentTime, setCurrentTime] = useState(0);

    const [mode, setMode] = useState('discuss');
    const isReviewMode = mode === 'review';

    const { transcripts, notes, updateNote, selectedCaptionIndex, setSelectedCaptionIndex } =
        useTranscript(currentTime);

    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'review' || modeParam === 'discuss') {
            setMode(modeParam);
        }
    }, []);

    const handleNoteChange = (newNote) => {
        if (selectedCaptionIndex !== -1) {
            updateNote(selectedCaptionIndex, newNote);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target.tagName === 'MAIN' || e.currentTarget === e.target) {
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
                    setSelectedCaptionIndex={setSelectedCaptionIndex}
                    onNoteChange={handleNoteChange}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    transcripts={transcripts}
                />
            </main>
        </div>
    );
}
