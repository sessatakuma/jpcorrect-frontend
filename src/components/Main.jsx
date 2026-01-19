import React, { useState } from 'react';

import Display from 'components/Display';
import Hint from 'components/Hint';
import Nav from 'components/Nav';
import Notes from 'components/Notes';
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
                <div className='right-panel'>
                    <div className='panel-switcher'>
                        <button
                            onClick={() => setRightPanel('notes')}
                            className={rightPanel === 'notes' ? 'active' : ''}
                        >
                            ノート
                        </button>
                        <button
                            onClick={() => setRightPanel('ai')}
                            className={rightPanel === 'ai' ? 'active' : ''}
                        >
                            AI 添削
                        </button>
                    </div>
                    {rightPanel === 'notes' ? (
                        <Notes
                            note={selectedCaptionIndex !== -1 ? notes[selectedCaptionIndex] : ''}
                            onNoteChange={handleNoteChange}
                            feedback={feedback}
                            setFeedback={setFeedback}
                            selectedCaptionIndex={selectedCaptionIndex}
                        />
                    ) : (
                        <Hint />
                    )}
                </div>
            </main>
        </>
    );
}
