import React, { useState, useEffect, useRef } from "react";
import Hint from 'components/Hint';
import 'components/Transcript.css';
import getCaptionData from "utilities/getCaptionData";

export default function Transcript({playerRef, currentTime}) {
    const list = getCaptionData();
    
    const [containerHeight, setContainerHeight] = useState(0);
    const [noteHeights, setNoteheights] = useState([]);
    const [fillerHeight, setFillerHeight] = useState(0);

    const [expanded, setExpanded] = useState(-1);
    const [unlockProgress, setUnlockProgress] = useState(Array(list.length).fill(0));
    const [currentCaption, setCurrentCaption] = useState(0);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const captionRefs = useRef([]);
    const noteRefs = useRef([]);
    const animationRefs = useRef([]);

    useEffect(() => {
        const height = containerRef.current.offsetHeight - headerRef.current.offsetHeight;
        setContainerHeight(height);
        setFillerHeight(height - captionRefs.current[list.length - 1].offsetHeight);
    }, []);
    
    useEffect(() => {
        const height = containerRef.current.offsetHeight - headerRef.current.offsetHeight;
        setNoteheights(captionRefs.current.map(caption => {height - caption.offsetHeight}))
    }, [expanded]);

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

    useEffect(() => {
        unlockProgress.forEach((progress, i) => {
            if (progress === 100 && expanded !== i) {
                scrollToCaption(i);
                setExpanded(i);
            }
        });
    }, [unlockProgress, expanded]);

    const scrollToCaption = i => {
        if (!containerRef.current || !captionRefs.current[i]) return;
        containerRef.current.scrollTo({
            top: captionRefs.current[i].offsetTop - headerRef.current.offsetHeight,
            behavior: 'smooth'
        }
    )};

    const setTime = time => playerRef.current && playerRef.current.seekTo(time, true);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const handleUnlockStart = (e, i) => {
        e.preventDefault();

        if (unlockProgress[i] === 100) return; // already unlocked

        if (animationRefs.current[i])
            clearInterval(animationRefs.current[i]);

        lockAll();

        const startTime = Date.now();
        const duration = 600; // 0.6 seconds
        animationRefs.current[i] = setInterval(() => {
            const elapsed = Date.now() - startTime;
            let linear = Math.min(elapsed / duration, 1);   // 0 → 1
            let eased = easeOutCubic(linear);               // apply easing
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

    const getClasses = i => 
        `${i === expanded ? 'expanded' : ''} ${i === currentCaption ? 'current' : ''} ${unlockProgress[i] === 100 ? 'unlocked' : ''}`

    return (
        <section className="transcript-container">
            <section
                className="transcript"
                ref={containerRef}
                // onWheel={lockAll}
                // onTouchMove={lockAll}
            >
                <h3 ref={headerRef}>文字起こし</h3>
                {list.map((caption, i) => 
                    <div 
                        className="caption-container" 
                        key={i} 
                        style={{"--container-height": containerHeight + 'px'}}>
                        <div 
                            className={`caption ${getClasses(i)}`}
                            ref={el => captionRefs.current[i] = el}
                            style={{"--progress": unlockProgress[i] + '%'}}
                            onClick={() => setTime(caption.time)}
                            onContextMenu={e => handleUnlockStart(e, i)}
                            onMouseUp={e => handleUnlockEnd(e, i)}
                        >
                            <img className="icon" src='images/icon.png'/>
                            <p className='text'>
                                {caption.text}
                            </p>
                        </div>
                        <p 
                            className="note" 
                            ref={el => noteRefs.current[i] = el}
                            style={{"--note-height": noteHeights[i] + 'px'}}
                            contentEditable
                        >
                            {/* <div className="mistake-hint">
                                <h4 className="type">別に問題ない</h4>
                                <p>何しとんねん</p>
                            </div> */}
                        </p>
                    </div>
                )}
                <div className="filler" style={{height: fillerHeight}}></div>
            </section>
            <Hint />
        </section>
    )
}