import React from 'react';

import Hint from 'components/Hint';
import Notes from 'components/Notes';

import 'components/RightPanel.css';

export default function RightPanel({
    rightPanel,
    setRightPanel,
    notes,
    selectedCaptionIndex,
    onNoteChange,
    feedback,
    setFeedback,
    transcripts,
}) {
    return (
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
                    onNoteChange={onNoteChange}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    selectedCaptionIndex={selectedCaptionIndex}
                    selectedCaption={
                        selectedCaptionIndex !== -1
                            ? transcripts[selectedCaptionIndex]
                            : null
                    }
                />
            ) : (
                <Hint />
            )}
        </div>
    );
}
