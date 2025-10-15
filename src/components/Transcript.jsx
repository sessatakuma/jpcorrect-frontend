import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Hint from 'components/Hint';
import 'components/Transcript.css';

import getCaptionData from "utilities/getCaptionData.js";

export default function Transcript({ playerRef, currentTime }) {
    // array of {time, text, feedbacks}
    // feedbacks: array of {type, highlight_part, comment}
    // type: vocab, grammar, voice or advance
    const captions = getCaptionData();

    const [containerHeight, setContainerHeight] = useState(1000);
    const [fillerHeight, setFillerHeight] = useState(0);

    const [expanded, setExpanded] = useState(-1);
    const [unlockProgress, setUnlockProgress] = useState(Array(captions.length).fill(0));
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const captionRefs = useRef([]);
    const animationRefs = useRef([]);

    useLayoutEffect(() => {
        setFillerHeight(
            containerRef.current.offsetHeight -
                headerRef.current.offsetHeight -
                captionRefs.current[captions.length - 1].offsetHeight,
        );
    }, []);

    useLayoutEffect(() => {
        setContainerHeight(
            Math.min(
                containerHeight,
                containerRef.current.offsetHeight - headerRef.current.offsetHeight,
            ),
        );
    }, [expanded]);

    useLayoutEffect(() => {
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

    useLayoutEffect(() => {
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && expanded !== i) {
                scrollToCaption(i);
                setExpanded(i);
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

    const setTime = (time) => layerRef.current && playerRef.current.seekTo(time, true);

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
    };

    const getClasses = (i) =>
        `${i === expanded ? 'expanded' : ''} ${i === currentCaption ? 'current' : ''} ${
            unlockProgress[i] === 100 ? 'unlocked' : ''
        }`;

    return (
        <section className='transcript-container'>
            <section
                className='transcript'
                ref={containerRef}
                onWheel={lockAll}
                onTouchMove={lockAll}
            >
                <h3 ref={headerRef}>文字起こし</h3>
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
                            onClick={() => setTime(caption.time)}
                            onContextMenu={(e) => handleUnlockStart(e, i)}
                            onMouseUp={(e) => handleUnlockEnd(e, i)}
                        >
                            <img className='icon' src='images/icon.png' />
                            <p className='text'>{caption.text}</p>
                        </div>
                        {i === expanded && (
                            <button className='close-note' onClick={lockAll}>
                                <i className='fa-solid fa-angle-up'></i>
                            </button>
                        )}
                        <p className='note' contentEditable></p>
                        {/* <div className="mistake-hint">
                            <h4 className="type">Type</h4>
                            <p>description</p>
                        </div> */}
                    </div>
                ))}
                <div className='filler' style={{ height: fillerHeight }}></div>
            </section>
            <Hint />
        </section>
    );
}
