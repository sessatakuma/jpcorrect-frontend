import React, { useState, useEffect } from 'react';

import Hint from 'components/Hint';
import Notes from 'components/Notes';

import type { Feedback, TranscriptItem } from 'src/types/transcript';

import 'components/RightPanel.css';

interface RightPanelProps {
    notes: string[];
    selectedCaptionIndex: number;
    onNoteChange: (newNote: string) => void;
    feedback: Feedback | null;
    setFeedback: React.Dispatch<React.SetStateAction<Feedback | null>>;
    transcripts: TranscriptItem[];
}

export default function RightPanel({
    notes,
    selectedCaptionIndex,
    onNoteChange,
    feedback,
    setFeedback,
    transcripts,
}: RightPanelProps) {
    const [rightPanel, setRightPanel] = useState('notes');

    useEffect(() => {
        if (selectedCaptionIndex !== -1) {
            setRightPanel('notes');
        }
    }, [selectedCaptionIndex]);

    const panels = {
        notes: (
            <Notes
                note={selectedCaptionIndex !== -1 ? notes[selectedCaptionIndex] : ''}
                onNoteChange={onNoteChange}
                feedback={feedback}
                setFeedback={setFeedback}
                selectedCaptionIndex={selectedCaptionIndex}
                selectedCaption={
                    selectedCaptionIndex !== -1 ? transcripts[selectedCaptionIndex] : null
                }
            />
        ),
        hint: <Hint />,
    };

    const panelLabels = {
        notes: 'ノート',
        hint: 'AI 添削',
    };

    return (
        <div className='right-panel'>
            <div className='panel-switcher'>
                {Object.keys(panels).map((key) => (
                    <button
                        key={key}
                        onClick={() => setRightPanel(key)}
                        className={rightPanel === key ? 'active' : ''}
                    >
                        {panelLabels[key]}
                    </button>
                ))}
            </div>
            <div className='content'>{panels[rightPanel]}</div>
        </div>
    );
}
