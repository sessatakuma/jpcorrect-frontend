import React, { useState } from 'react';

import Display from 'components/Display';
import Nav from 'components/Nav';
import RightPanel from 'components/RightPanel';
import useTranscriptData from 'hook/useTranscriptData';

import 'components/Main.css';

export default function Main() {
    const [rightPanel, setRightPanel] = useState('notes'); // 'notes' or 'ai'
    const { transcripts, notes, updateNote } = useTranscriptData();
    const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(-1);
    const [feedback, setFeedback] = useState(null);

    const handleNoteChange = (newNote) => {
        if (selectedCaptionIndex !== -1) {
            updateNote(selectedCaptionIndex, newNote);
        }
    };

    const handleSetFeedback = (feedback) => {
        setFeedback(feedback);
        setRightPanel('notes');
    };

    return (
        <>
            <Nav />
            <main>
                <Display
                    transcripts={transcripts}
                    selectedCaptionIndex={selectedCaptionIndex}
                    setSelectedCaptionIndex={setSelectedCaptionIndex}
                    setFeedback={handleSetFeedback}
                />
                <RightPanel
                    rightPanel={rightPanel}
                    setRightPanel={setRightPanel}
                    notes={notes}
                    selectedCaptionIndex={selectedCaptionIndex}
                    onNoteChange={handleNoteChange}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    transcripts={transcripts}
                />
            </main>
        </>
    );
}
