import React, { useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import PropTypes from 'prop-types';

import 'components/Notes.css';

Notes.propTypes = {
    note: PropTypes.string.isRequired,
    onNoteChange: PropTypes.func.isRequired,
    feedback: PropTypes.object,
    setFeedback: PropTypes.func.isRequired,
    selectedCaptionIndex: PropTypes.number.isRequired,
    selectedCaption: PropTypes.object,
};

export default function Notes({
    note,
    onNoteChange,
    feedback,
    setFeedback,
    selectedCaptionIndex,
    selectedCaption,
}) {
    const typeMap = { vocab: '単語', grammar: '文法', voice: '発音', advance: '上級' };
    const textareaRef = useRef(null);

    useEffect(() => {
        if (selectedCaptionIndex !== -1 && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [selectedCaptionIndex]);

    return (
        <section className='notes'>
            {selectedCaptionIndex === -1 ? (
                <div className='placeholder'>
                    <p>サブタイトルをクリックすると、対応するメモが開きます。</p>
                </div>
            ) : (
                <div className='notes-content'>
                    {selectedCaption && (
                        <div className='selected-caption'>
                            <p className='text'>
                                {selectedCaption.textSegments.map((textSegment, j) => (
                                    <span
                                        className={
                                            textSegment.highlight
                                                ? 'highlight ' + textSegment.feedback.type
                                                : ''
                                        }
                                        key={j}
                                        onClick={(e) => {
                                            if (!textSegment.highlight) {
                                                return;
                                            }
                                            e.stopPropagation();
                                            setFeedback(textSegment.feedback);
                                        }}
                                    >
                                        {textSegment.text}
                                    </span>
                                ))}
                            </p>
                        </div>
                    )}
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
                        ref={textareaRef}
                        className='notes-textarea'
                        value={note}
                        onChange={(e) => onNoteChange(e.target.value)}
                        placeholder='メモを取りましょう'
                    />
                </div>
            )}
        </section>
    );
}
