import React, { useState, useRef, useEffect } from 'react';

import PropTypes from 'prop-types';
import './Transcript.css';

const speakerIcons = {
    宇昕_id: 'images/yuxin_icon.png',
    致越_id: 'images/chie_icon.png',
    牢大_id: 'images/man_icon.png',
    愛音_id: 'images/anon_icon.png',
    燈_id: 'images/tomori_icon.png',
    default: 'images/icon.png',
};

Transcript.propTypes = {
    playerRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    currentTime: PropTypes.number.isRequired,
    transcripts: PropTypes.array.isRequired,
    selectedCaptionIndex: PropTypes.number.isRequired,
    setSelectedCaptionIndex: PropTypes.func.isRequired,
    setFeedback: PropTypes.func.isRequired,
};

export default function Transcript({
    playerRef,
    currentTime,
    transcripts,
    selectedCaptionIndex,
    setSelectedCaptionIndex,
    setFeedback,
}) {
    // 移除 containerHeight 相關 useState
    const [currentCaption, setCurrentCaption] = useState(0);
    const [mode, setMode] = useState('discuss');

    const containerRef = useRef(null);
    const captionRefs = useRef([]);

    // 修正順序：確保在 useState 之後定義
    const isReviewMode = mode === 'review';

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'review' || modeParam === 'discuss') {
            setMode(modeParam);
        }
    }, []);

    // 移除原本計算 containerHeight 的 useLayoutEffect，
    // 因為現在右鍵點擊不再需要左側外觀產生高度變化

    useEffect(() => {
        let captionIndex = -1;
        for (let i = 0; i < transcripts.length; i++) {
            if (currentTime >= transcripts[i].time) {
                captionIndex = i;
            } else {
                break;
            }
        }

        if (captionIndex === currentCaption) {
            return;
        }

        setCurrentCaption(captionIndex);

        if (selectedCaptionIndex === -1) {
            scrollToCaption(captionIndex);
        }
    }, [currentTime]);

    useEffect(() => {
        if (selectedCaptionIndex !== -1) {
            scrollToCaption(selectedCaptionIndex);
        }
    }, [selectedCaptionIndex]);

    const scrollToCaption = (i) => {
        if (!containerRef.current || !captionRefs.current[i]) {
            console.warn('caption not found');
        } else {
            const rect = captionRefs.current[i].getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const top = rect.top - containerRect.top + containerRef.current.scrollTop;
            containerRef.current.scrollTo({
                top: top,
                behavior: 'smooth',
            });
        }
    };

    const setTime = (time) => playerRef.current && playerRef.current.seekTo(time, true);

    const handleContextMenu = (e, i) => {
        e.preventDefault();
        lockAll();
        setSelectedCaptionIndex(i);
    };

    const lockAll = () => {
        setSelectedCaptionIndex(-1);
        setFeedback(null);
    };

    const handleCaptionClick = (index) => {
        if (index !== selectedCaptionIndex) {
            setTime(transcripts[index].time);
        }
    };

    const getClasses = (i) => `${i === currentCaption ? 'current' : ''}`;

    return (
        <section className='transcript-container'>
            <section
                className='transcript'
                ref={containerRef}
                onWheel={lockAll}
                onTouchMove={lockAll}
            >
                <div className='captions'>
                    {transcripts.map((caption, i) => (
                        <div
                            className='caption-container'
                            key={i}
                            // 移除 style={{ '--container-height': ... }}
                        >
                            <div
                                className={`caption ${getClasses(i)}`}
                                ref={(el) => (captionRefs.current[i] = el)}
                                onClick={() => handleCaptionClick(i)}
                                onContextMenu={(e) => handleContextMenu(e, i)}
                            >
                                <img
                                    className='icon'
                                    src={speakerIcons[caption.speaker_id] || speakerIcons.default}
                                    alt={caption.speaker_id || 'unknowspeaker'}
                                />
                                <p className='text'>
                                    {caption.textSegments.map((textSegment, j) => (
                                        <span
                                            className={
                                                isReviewMode && textSegment.highlight
                                                    ? 'highlight ' + textSegment.feedback.type
                                                    : ''
                                            }
                                            key={j}
                                            onClick={(e) => {
                                                if (!textSegment.highlight) return;
                                                e.stopPropagation();
                                                setFeedback(textSegment.feedback);
                                            }}
                                        >
                                            {textSegment.text}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}
