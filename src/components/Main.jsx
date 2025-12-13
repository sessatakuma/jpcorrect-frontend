import React, { useState, useEffect, useRef } from 'react';

import Display from 'components/Display';
import Footer from 'components/Footer';
import Hint from 'components/Hint';
import Nav from 'components/Nav';

import 'components/Main.css';

export default function Main() {
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime)
                setCurrentTime(playerRef.current.getCurrentTime());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Nav />
            <main>
                <Display playerRef={playerRef} currentTime={currentTime} />
                <Hint></Hint>
            </main>
            <Footer />
        </>
    );
}
