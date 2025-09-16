import React, { useState, useEffect, useRef } from "react";
import 'components/Transcript.css';
import Hint from 'components/Hint';
import getCaptionData from "../utilities/getCaptionData";

export default function Transcript({currentTime, setCurrentTime}) {
    const list = getCaptionData();
    
    const [containerHeight, setContainerHeight] = useState(0);
    const [fillerHeight, setFillerHeight] = useState(0);

    const [expanded, setExpanded] = useState(-1);
    const [unlockProgress, setUnlockProgress] = useState(Array(list.length).fill(0));
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const captionRefs = useRef([]);
    const animationRefs = useRef([]);

    useEffect(() => {
        setContainerHeight(containerRef.current.offsetHeight - headerRef.current.offsetHeight);
        setFillerHeight(
            containerRef.current.offsetHeight 
            - captionRefs.current[list.length - 1].offsetHeight 
            - headerRef.current.offsetHeight
        );
    }, []);

    useEffect(() => {
        // Expand caption when unlockProgress reaches 100
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && expanded !== i) {
                containerRef.current.scrollTo({
                    top: captionRefs.current[i].offsetTop - headerRef.current.offsetHeight,
                    behavior: 'smooth'
                });
                setExpanded(i);
            }
        });
    }, [unlockProgress, expanded]);

    useEffect(() => {
        let captionIndex = -1;
        for (let i = 0; i < list.length; i++) {
            if (currentTime >= list[i].time) 
                captionIndex = i;
            else 
                break;
        }
        setCurrentCaption(captionIndex);
        // let tooHigh = captionRefs.current[captionIndex].offsetTop < containerRef.current.scrollTop + headerRef.current.offsetHeight;
        // let tooLow = captionRefs.current[captionIndex].offsetTop + captionRefs.current[captionIndex].offsetHeight > containerRef.current.scrollTop + containerRef.current.offsetHeight;
        if (expanded !== -1) return; // don't auto-scroll if a caption is expanded
        containerRef.current.scrollTo({
            top: captionRefs.current[captionIndex].offsetTop - headerRef.current.offsetHeight,
            behavior: 'smooth'
        });
    }, [currentTime]);

    // Easing helpers
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const handleUnlockStart = (e, i) => {
        e.preventDefault();

        if (unlockProgress[i] === 100) return; // already unlocked

        if (animationRefs.current[i]) {
            clearInterval(animationRefs.current[i]);
        }

        lockAll();

        const startTime = Date.now();
        const duration = 800; // 0.8 seconds
        animationRefs.current[i] = setInterval(() => {
            const elapsed = Date.now() - startTime;
            let linear = Math.min(elapsed / duration, 1);   // 0 → 1
            let eased = easeOutCubic(linear);               // apply easing
            let progress = eased * 100;

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
        if (e.button !== 2) return;
        if (unlockProgress[i] >= 95) {
            setUnlockProgress((prev) => {
                const newProgress = [...prev];
                newProgress[i] = 100;
                return newProgress;
            });
            return;
        }
        lockAll();
        if (animationRefs.current[i]) {
            clearInterval(animationRefs.current[i]);
            animationRefs.current[i] = null;
        }
    };

    const lockAll = () => {
        setUnlockProgress(Array(list.length).fill(0));
        setExpanded(-1);
    }

    return (
        <section className={"transcript-container" + (expanded !== -1 ? ' expanded' : '')}>
            <section
                    className="transcript"
                    ref={containerRef}
                    onWheel={lockAll}
                    onTouchMove={lockAll}
                >
                <div className="header" ref={headerRef}>文字起こし</div>
                {list.map((caption, i) => 
                    <div className="caption-container" key={i} style={{height: (i === expanded ? containerHeight : 'auto')}}>
                        <div 
                            className={`
                                caption ${i === expanded ? 'expanded' : ''} 
                                ${unlockProgress[i] === 100 ? 'unlocked' : ''}
                                ${i === currentCaption ? 'current' : ''}`}
                            onClick={() => setTimeout(() => setCurrentTime(caption.time), 100)}
                            onContextMenu={e => {handleUnlockStart(e, i);}}
                            onMouseUp={e => handleUnlockEnd(e, i)}
                            ref={el => captionRefs.current[i] = el}
                            style={{"--progress": unlockProgress[i] + '%'}}
                        >
                            <img className="icon" src='images/icon.png'/>
                            <p className='text'>{caption.text}</p>
                        </div>
                        <p className="note" contentEditable></p>
                    </div>
                )}
                <div className="filler" style={{height: fillerHeight}}></div>
            </section>
            <Hint />
        </section>
    )
}