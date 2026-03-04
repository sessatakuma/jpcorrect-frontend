import React, { useState, useRef, useEffect } from 'react';

import type { Feedback, TranscriptItem } from 'src/types/transcript';

import './Transcript.css';

const speakerIcons = {
    宇昕_id: 'images/yuxin_icon.png',
    致越_id: 'images/chie_icon.png',
    牢大_id: 'images/man_icon.png',
    愛音_id: 'images/anon_icon.png',
    燈_id: 'images/tomori_icon.png',
    default: 'images/icon.png',
};

interface PlayerApi {
    seekTo: (time: number, allowSeekAhead: boolean) => void;
}

interface TranscriptProps {
    playerRef: React.MutableRefObject<PlayerApi | null>;
    currentTime: number;
    transcripts: TranscriptItem[];
    selectedCaptionIndex: number;
    setSelectedCaptionIndex: React.Dispatch<React.SetStateAction<number>>;
    setFeedback: React.Dispatch<React.SetStateAction<Feedback | null>>;
    isReviewMode: boolean;
}

export default function Transcript({
    playerRef,
    currentTime,
    transcripts,
    selectedCaptionIndex,
    setSelectedCaptionIndex,
    setFeedback,
    isReviewMode,
}: TranscriptProps) {
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const captionRefs = useRef<Array<HTMLDivElement | null>>([]);

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

        scrollToCaption(captionIndex);
    }, [currentTime]);

    useEffect(() => {
        if (selectedCaptionIndex !== -1) {
            scrollToCaption(selectedCaptionIndex);
        }
    }, [selectedCaptionIndex]);

    const scrollToCaption = (i: number) => {
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

    const setTime = (time: number) => playerRef.current && playerRef.current.seekTo(time, true);

    const lockAll = () => {
        setSelectedCaptionIndex(-1);
        setFeedback(null);
    };

    const handleCaptionClick = (index: number) => {
        if (index !== selectedCaptionIndex) {
            setTime(transcripts[index].time);
        }
        lockAll();
        setSelectedCaptionIndex(index);
    };

    const getClasses = (i: number) => `${i === currentCaption ? 'current' : ''}`;

    return (
        <section className='transcript-container'>
            <section className='transcript'>
                <div className='captions' ref={containerRef}>
                    {transcripts.map((caption, i) => (
                        <div className='caption-container' key={i}>
                            <div
                                className={`caption ${getClasses(i)}`}
                                ref={(el) => {
                                    captionRefs.current[i] = el;
                                }}
                                onClick={() => handleCaptionClick(i)}
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
                                                isReviewMode && textSegment.highlight && textSegment.feedback
                                                    ? 'highlight ' + textSegment.feedback.type
                                                    : ''
                                            }
                                            key={j}
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
