import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import 'components/Display.css';
import VideoInfo from "components/VideoInfo";

export default function Display() {
    const playerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const onReady = e => {
        playerRef.current = e.target;
        setDuration(playerRef.current.getDuration());
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            const state = playerRef.current.getPlayerState();
            if (state === window.YT.PlayerState.PLAYING) 
                playerRef.current.pauseVideo();
            else 
                playerRef.current.playVideo();
        }   
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 500); 
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const opts = {
        playerVars: {
            controls: 0,
            autoplay: 0,
        },
    };

    return (
        <section className="display">
            <div className="video">
                <YouTube 
                className="youtube"
                    videoId="3DrYQMK4hJE" 
                    opts={opts} 
                    onReady={onReady} 
                />
                <div className="timeline">
                    <span className="time-left">{formatTime(currentTime)}</span>
                    <div className="progress-container">
                        <div className="progress"></div>
                        <div className="dot" style={{ left: "20%" }} />
                        <div className="dot" style={{ left: "40%" }} />
                    </div>
                    <span className="time-right">{formatTime(duration)}</span>
                </div>
                <div className="control">
                    <button className="previous">
                        <i className="fa-solid fa-backward-step"></i>
                    </button>
                    <button className="play-pause" onClick={handlePlayPause}>
                        <i className="fa-solid fa-play"></i>
                    </button>
                    <button className="next">
                    <i className="fa-solid fa-forward-step"></i>
                    </button>
                </div>
            </div>
            <VideoInfo />
        </section>
  );
}