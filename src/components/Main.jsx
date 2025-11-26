import React, { useState, useEffect, useRef } from 'react';

import Nav from 'components/Nav';
import Display from 'components/Display';
import Transcript from 'components/Transcript';
import Footer from 'components/Footer';

import 'components/Main.css';

export default function Main(props) {
    const [currentTime, setCurrentTime] = useState(0);
    const [mode, setMode] = useState('discuss'); // 'discuss' or 'review'
    const playerRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'review' || modeParam === 'discuss') {
            setMode(modeParam);
        }
    }, []);

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
                <Transcript playerRef={playerRef} currentTime={currentTime} mode={mode} />
            </main>
            <Footer />
        </>
    );
}
