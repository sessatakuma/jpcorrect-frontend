import React from 'react';

import Hint from 'components/Hint';
import Notes from 'components/Notes';
import PropTypes from 'prop-types';
import 'components/RightPanel.css';

RightPanel.propTypes = {
    rightPanel: PropTypes.string.isRequired,
    setRightPanel: PropTypes.func.isRequired,
    notes: PropTypes.array.isRequired,
    selectedCaptionIndex: PropTypes.number.isRequired,
    onNoteChange: PropTypes.func.isRequired,
    feedback: PropTypes.object,
    setFeedback: PropTypes.func.isRequired,
    transcripts: PropTypes.array.isRequired,
};

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
        ai: <Hint />,
    };

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
            <div className='content'>{panels[rightPanel]}</div>
        </div>
    );
}
