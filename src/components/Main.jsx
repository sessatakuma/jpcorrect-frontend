import React, { useState } from 'react';

import Display from 'components/Display';
import Nav from 'components/Nav';
import RightPanel from 'components/RightPanel';
import useTranscript from 'hook/useTranscript';

import 'components/Main.css';

export default function Main() {
    const [currentTime, setCurrentTime] = useState(0);

    const { transcripts, notes, updateNote, selectedCaptionIndex, setSelectedCaptionIndex } =
        useTranscript(currentTime);

    const [feedback, setFeedback] = useState(null);

    const handleNoteChange = (newNote) => {
        if (selectedCaptionIndex !== -1) {
            updateNote(selectedCaptionIndex, newNote);
        }
    };

    return (
        <>
            <Nav />
            <main>
                <Display
                    transcripts={transcripts}
                    selectedCaptionIndex={selectedCaptionIndex}
                    setSelectedCaptionIndex={setSelectedCaptionIndex}
                    setFeedback={setFeedback}
                    setCurrentTime={setCurrentTime}
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
        </>
    );
}
