import React, { useEffect, useRef } from 'react'; // 1. 引入 useEffect 和 useRef

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
    const typeMap = { vocab: '単語', grammar: '文法', voice: '發音', advance: '上級' };

    // 2. 建立一個 Ref 用於 textarea
    const textareaRef = useRef(null);

    // 3. 監聽 selectedCaptionIndex，當它變動且不為 -1 時自動聚焦
    useEffect(() => {
        if (selectedCaptionIndex !== -1 && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [selectedCaptionIndex]);

    return (
        <section className='notes'>
            {selectedCaptionIndex === -1 ? (
                <div className='placeholder'>
                    <p>サブタイトルを右クリックすると、対応するメモが開きます。</p>
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
                        ref={textareaRef} // 4. 將 Ref 綁定到 DOM
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
