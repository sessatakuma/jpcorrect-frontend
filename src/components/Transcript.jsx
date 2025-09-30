import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import 'components/Transcript.css';
import Hint from 'components/Hint';
import getCaptionData from "../utilities/getCaptionData";

export default function Transcript({playerRef, currentTime}) {
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
        let captionIndex = -1;
        for (let i = 0; i < list.length; i++) {
            if (currentTime >= list[i].time) 
                captionIndex = i;
            else 
                break;
        }
        setCurrentCaption(captionIndex);

        if (expanded === -1)
            scrollToCaption(captionIndex);
    }, [currentTime]);

    const scrollToCaption = i => {
        if (!containerRef.current || !captionRefs.current[i]) return;
        containerRef.current.scrollTo({
            top: captionRefs.current[i].offsetTop - headerRef.current.offsetHeight,
            behavior: 'smooth'
        }
    )};

    useEffect(() => {
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && expanded !== i) {
                scrollToCaption(i);
                setExpanded(i);
            }
        });
    }, [unlockProgress, expanded]);

    const setTime = time => playerRef.current && playerRef.current.seekTo(time, true);

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
        if (e.button !== 2) return; // 右鍵解鎖

        if (unlockProgress[i] >= 95) { // 快解鎖就放開也解鎖
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
                            onClick={() => setTime(caption.time)}
                            onContextMenu={e => handleUnlockStart(e, i)}
                            onMouseUp={e => handleUnlockEnd(e, i)}
                            ref={el => captionRefs.current[i] = el}
                            style={{"--progress": unlockProgress[i] + '%'}}
                        >
                            <img className="icon" src='images/icon.png'/>
                            <p className='text'>{caption.text}</p>
                        </div>  
                        {i === expanded && 
                            <button className="close-note" onClick={lockAll}>
                                <i className="fa-solid fa-angle-up"></i> 
                            </button>}                                                    
                        <p className="note" contentEditable></p>                        
                    </div>
                )}
                <div className="filler" style={{height: fillerHeight}}></div>
            </section>
            <Hint />
        </section>
    )
}