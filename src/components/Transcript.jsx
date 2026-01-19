import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

import { ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';

import './Transcript.css';

const speakerIcons = {
    "宇昕_id": "images/yuxin_icon.png",
    "致越_id": "images/chie_icon.png",
    "牢大_id": "images/man_icon.png",
    "愛音_id": "images/anon_icon.png",
    "燈_id": "images/tomori_icon.png",
    "default": "images/icon.png" 
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
    const [containerHeight, setContainerHeight] = useState(0);
    const [unlockProgress, setUnlockProgress] = useState(Array(transcripts.length).fill(0));
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef(null);
    const captionRefs = useRef([]);
    const animationRefs = useRef([]);

    const isReviewMode = mode === 'review';

    //const typeMap = { vocab: '単語', grammar: '文法', voice: '発音', advance: '上級' };

    const [mode, setMode] = useState('discuss'); // 'discuss' or 'review'

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'review' || modeParam === 'discuss') {
            setMode(modeParam);
        }
    }, []);

    useLayoutEffect(() => {
        setTimeout(() => {
            if (containerRef.current) setContainerHeight(containerRef.current.offsetHeight);
        }, 250);
    }, [selectedCaptionIndex]);

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
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && selectedCaptionIndex !== i) {
                scrollToCaption(i);
                setSelectedCaptionIndex(i);
            }
        });
    }, [unlockProgress, selectedCaptionIndex]);

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

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const handleUnlockStart = (e, i) => {
        e.preventDefault();

        if (unlockProgress[i] === 100) return; // already unlocked

        if (animationRefs.current[i]) clearInterval(animationRefs.current[i]);

        lockAll();

        const startTime = Date.now();
        const duration = 600; // 0.6 seconds
        animationRefs.current[i] = setInterval(() => {
            const elapsed = Date.now() - startTime;
            let linear = Math.min(elapsed / duration, 1); // 0 → 1
            let eased = easeOutCubic(linear); // apply easing
            let progress = Math.round(eased * 100 * 100) / 100;

            setUnlockProgress((prev) => {
                const newProgress = [...prev];
                newProgress[i] = progress;
                return newProgress;
            });

            if (linear >= 1) {
                clearInterval(animationRefs.current[i]);
                animationRefs.current[i] = null;
            }
        }, 16); // ~60fps
    };

    const handleUnlockEnd = (e, i) => {
        if (e.button !== 2 && e.type !== 'touchend') return;

        if (unlockProgress[i] >= 95) {
            setUnlockProgress((prev) => {
                const newProgress = [...prev];
                newProgress[i] = 100;
                return newProgress;
            });
            scrollToCaption(i);
            setSelectedCaptionIndex(i);
            return;
        }

        lockAll();
        if (animationRefs.current[i]) {
            clearInterval(animationRefs.current[i]);
            animationRefs.current[i] = null;
        }
    };

    const lockAll = () => {
        setUnlockProgress(Array(transcripts.length).fill(0));
        setSelectedCaptionIndex(-1);
        setFeedback(null);
    };

    const handleCaptionClick = (index) => {
        if (index !== selectedCaptionIndex) {
            setTime(transcripts[index].time);
        }
    };

    const getClasses = (i) =>
        `${i === selectedCaptionIndex ? 'expanded' : ''} ${i === currentCaption ? 'current' : ''}`;

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
                            style={{ '--container-height': containerHeight + 'px' }}
                        >
                            <div
                                className={`caption ${getClasses(i)}`}
                                ref={(el) => (captionRefs.current[i] = el)}
                                style={{ '--progress': unlockProgress[i] + '%' }}
                                onClick={() => handleCaptionClick(i)}
                                onContextMenu={(e) => handleUnlockStart(e, i)}
                                onMouseUp={(e) => handleUnlockEnd(e, i)}
                                onTouchStart={(e) => handleUnlockStart(e, i)}
                                onTouchEnd={(e) => handleUnlockEnd(e, i)}
                            >
                                <img className='icon' src={speakerIcons[caption.speaker_id] || speakerIcons.default} alt={caption.speaker_id || 'unknowspeaker'}/>
                                <p className='text'>
                                    {caption.textSegments.map((textSegment, j) => (
                                        <span
                                            className={
                                                (i === selectedCaptionIndex || isReviewMode) &&
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
                            {i === selectedCaptionIndex && (
                                <button
                                    className='close-note'
                                    onClick={() => setSelectedCaptionIndex(-1)}
                                >
                                    <ChevronUp />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}
