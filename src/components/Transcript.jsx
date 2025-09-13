import React, { useState, useEffect, useRef } from "react";
import 'components/Transcript.css';

export default function Transcript() {
    const rawText = `
空っぽのサイレン
乾いた施錠音(せじょうおと)
ガラガラスケーター 
賑わえ三点リーダ
どんな言葉にも ちゃんと 
綻びがあった
もう 何も言わずに
遊ぼう(遊ぼう)

どうでもいい朝に 慣れ過ぎて 傘は持ってない 借りてた未来 返しきれず かわしきれずからがら まちゆく余所者

ねえ ねえ 独りだ 肩触れたのは メイビー、レイニー 君はとうにいないんだね かなしくはないよ 嬉しくもないよ メイビー、レイニー よく晴れた鈍色に 減点式の舗装路を染める レイニー、レイニー こんな間違えたんだね 塗りつぶしてゆくパノラマ レイニー、レイニー 君は何点だったの

バイバイ バイバイ 
よく晴れた鈍色のしょうご
    `;

    // split by line breaks and trim
    const list = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) // remove empty lines
        .map(line => ({ name: 'Sui', text: line }));

    const [expanded, setExpanded] = useState(-1);
    const [containerHeight, setContainerHeight] = useState(0);
    const [fillerHeight, setFillerHeight] = useState(0);
    const [unlockProgress, setUnlockProgress] = useState(Array(list.length).fill(0));

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

    // Easing helpers
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const handleUnlockStart = (i) => {
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

    const handleUnlockEnd = (i) => {
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
        <section
                className="transcript"
                ref={containerRef}
                onWheel={lockAll}
                onTouchMove={lockAll}
            >
            <div className="header" ref={headerRef}>文字起こし</div>
            {list.map((t, i) => 
                <div className="caption-container" key={i} style={{height: (i === expanded ? containerHeight : 'auto')}}>
                    <div 
                        className={`caption ${i === expanded ? 'expanded' : ''} ${unlockProgress[i] === 100 ? 'unlocked' : ''}`}
                        onMouseDown={() => {handleUnlockStart(i);}}
                        onMouseUp={() => {handleUnlockEnd(i);}}
                        ref={el => captionRefs.current[i] = el}
                        style={{"--progress": unlockProgress[i] + '%'}}
                    >
                        <img className="icon" src='https://yt3.ggpht.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s88-c-k-c0x00ffffff-no-rj'/>
                        <p className='text'>{t.text}</p>
                    </div>
                    <p className="note" contentEditable style={{height: (i === expanded ? 'auto' : 0), padding: (i === expanded ? '1rem' : 0)}}></p>
                </div>
            )}
            <div className="filler" style={{"height": fillerHeight + 'px'}}></div>
        </section>
    )
}