import React from 'react';

import { X } from 'lucide-react';
import PropTypes from 'prop-types';

import 'components/Notes.css';

Notes.propTypes = {
    note: PropTypes.string.isRequired,
    onNoteChange: PropTypes.func.isRequired,
    feedback: PropTypes.object,
    setFeedback: PropTypes.func.isRequired,
    selectedCaptionIndex: PropTypes.number.isRequired,
};

export default function Notes({ note, onNoteChange, feedback, setFeedback, selectedCaptionIndex }) {
    const typeMap = { vocab: '単語', grammar: '文法', voice: '発音', advance: '上級' };

    return (
        <section className='notes'>
            <div className='header'>Notes</div>
            {selectedCaptionIndex === -1 ? (
                <div className='placeholder'>
                    <p>右鍵點擊字幕以開啟對應筆記</p>
                </div>
            ) : (
                <div className='notes-content'>
                    {feedback && (
                        <div className={'feedback ' + feedback.type}>
                            <div className='feedback-header'>
                                <h4>{typeMap[feedback.type] + 'の問題'}</h4>
                                <button
                                    className='close-feedback'
                                    onClick={() => setFeedback(null)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p>{feedback.comment}</p>
                        </div>
                    )}
                    <textarea
                        className='notes-textarea'
                        value={note}
                        onChange={(e) => onNoteChange(e.target.value)}
                        placeholder='Take a note...'
                    />
                </div>
            )}
        </section>
    );
}
