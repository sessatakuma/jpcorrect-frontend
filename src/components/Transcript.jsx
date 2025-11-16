import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Hint from './Hint';
import './Transcript.css';
import useTranscript from '../hook/useTranscript.js';

export default function Transcript({ playerRef, currentTime }) {
    const { date, practice_type, transcripts: captions} = useTranscript();
    // const captions = useTranscript();
    const [containerHeight, setContainerHeight] = useState(0);
    const [fillerHeight, setFillerHeight] = useState(0);

    const [expanded, setExpanded] = useState(-1);
    const [feedbackShown, setfeedbackShown] = useState(-1);
    const [unlockProgress, setUnlockProgress] = useState(Array(captions.length).fill(0));
    // TODO: change to single array [<unlockingIndex>, <progress>]
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const captionRefs = useRef([]);
    const animationRefs = useRef([]);
    const noteRefs = useRef([]);


    const typeMap = { vocab: '単語', grammar: '文法', voice: '発音', advance: '上級' };

    useLayoutEffect(() => {
        setFillerHeight(
            containerRef.current.offsetHeight -
                headerRef.current.offsetHeight -
                captionRefs.current[captions.length - 1].offsetHeight,
        );
        setContainerHeight((h) => {
            return Math.min(
                containerHeight,
                containerRef.current.offsetHeight - headerRef.current.offsetHeight,
            );
        });
    }, []);

    useLayoutEffect(() => {
        console.log('setting container height');
        setTimeout(() => {
            console.log('set container height');
            setContainerHeight(containerRef.current.offsetHeight - headerRef.current.offsetHeight);
        }, 250);
    }, [expanded]);

    useEffect(() => {
        let captionIndex = -1;
        for (let i = 0; i < captions.length; i++) {
            if (currentTime >= captions[i].time) {
                captionIndex = i;
            } else {
                break;
            }
        }

        if (captionIndex === currentCaption) {
            return;
        }

        setCurrentCaption(captionIndex);

        if (expanded === -1) {
            scrollToCaption(captionIndex);
        }
    }, [currentTime]);

    useEffect(() => {
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && expanded !== i) {
                scrollToCaption(i);
                setExpanded(i);

                // 解鎖完成後自動focus
                const note = noteRefs.current[i];
                if (note) {
                    setTimeout(() => {
                    note.focus();
                    }, 300);
                }
            }
        });
    }, [unlockProgress, expanded]);

    const scrollToCaption = (i) => {
        if (!containerRef.current || !captionRefs.current[i]) {
            console.warn('caption not found');
        } else {
            const rect = captionRefs.current[i].getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const top =
                rect.top -
                containerRect.top +
                containerRef.current.scrollTop -
                headerRef.current.offsetHeight;
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
        if (e.button !== 2) return; // 右鍵解鎖

        if (unlockProgress[i] >= 95) {
            // 快解鎖就放開也解鎖
            setUnlockProgress((prev) => {
                const newProgress = [...prev];
                newProgress[i] = 100;
                return newProgress;
            });
            scrollToCaption(i);
            setExpanded(i);
            return;
        }

        lockAll(); // 不然就鎖回去
        if (animationRefs.current[i]) {
            clearInterval(animationRefs.current[i]);
            animationRefs.current[i] = null;
        }
    };

    const lockAll = () => {
        setUnlockProgress(Array(captions.length).fill(0));
        setExpanded(-1);
        setfeedbackShown(-1);
    };

    const getClasses = (i) =>
        `${i === expanded ? 'expanded' : ''} ${i === currentCaption ? 'current' : ''}`;

    return (
        <section className='transcript-container'>
            <section
                className='transcript'
                ref={containerRef}
                onWheel={lockAll}
                onTouchMove={lockAll}
            >
                <h3 ref={headerRef}>{expanded !== -1 ? 'ノート' : '文字起こし'}</h3>
                {captions.map((caption, i) => (
                    <div
                        className='caption-container'
                        key={i}
                        style={{ '--container-height': containerHeight + 'px' }}
                    >
                        <div
                            className={`caption ${getClasses(i)}`}
                            ref={(el) => (captionRefs.current[i] = el)}
                            style={{ '--progress': unlockProgress[i] + '%' }}
                            onClick={() => i !== expanded && setTime(caption.time)}
                            onContextMenu={(e) => handleUnlockStart(e, i)}
                            onMouseUp={(e) => handleUnlockEnd(e, i)}
                        >
                            <img className='icon' src='images/icon.png' />
                            <p className='text'>
                                {caption.textSegments.map((textSegment, j) => (
                                    <span
                                        className={
                                            i === expanded && textSegment.highlight
                                                ? 'highlight ' + textSegment.feedback.type
                                                : ''
                                        }
                                        key={j}
                                        onClick={(e) => {
                                            if (!textSegment.highlight) {
                                                return;
                                            }
                                            e.stopPropagation;
                                            setfeedbackShown(j);
                                        }}
                                    >
                                        {textSegment.text}
                                    </span>
                                ))}
                            </p>
                        </div>
                        {(() => {
                            let feedback = caption.textSegments[feedbackShown]?.feedback;
                            return (
                                <div
                                    className={
                                        'feedback ' +
                                        feedback?.type +
                                        (feedbackShown !== -1 && feedback ? ' shown' : '')
                                    }
                                >
                                    <h4>{feedback && typeMap[feedback.type] + 'の問題'}</h4>
                                    <p>{feedback?.comment}</p>
                                </div>
                            );
                        })()}
                        {i === expanded && (
                            <button className='close-note' onClick={lockAll}>
                                <i className='fa-solid fa-angle-up'></i>
                            </button>
                        )}
                        <p className='note' 
                           contentEditable
                           ref={(el) => noteRefs.current[i] = el}
                        />
                    </div>
                ))}
                <div className='filler' style={{ height: fillerHeight }}></div>
            </section>
            <Hint />
        </section>
    );
}
