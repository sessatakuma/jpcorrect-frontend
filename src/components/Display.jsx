import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import 'components/Display.css';
import VideoInfo from "components/VideoInfo";

export default function Display({currentTime, setCurrentTime}) {
    const playerRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (playerRef.current) {
            const state = playerRef.current.getPlayerState();
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
        }   
    }, [playerRef.current]);

    const onReady = e => {
        playerRef.current = e.target;
        setDuration(playerRef.current.getDuration());
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            const state = playerRef.current.getPlayerState();
            if (state === window.YT.PlayerState.PLAYING) {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
            }
            else {
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        }   
    };
    
    const goPrevious = () => {
        if (!playerRef.current)
            return;

        const prevTime = list.find(time => time < currentTime);
        if(prevTime !== undefined){
            playerRef.current.seekTo(prevTime, true);
            setCurrentTime(prevTime);
        }else{
            playerRef.current.seekTo(0,true);
            setCurrentTime(0);
        }
    };

    const goNext = () => {
        if (!playerRef.current)
            return;

        const nextTime = list.find(time => time > currentTime);
        if(nextTime !== undefined){
            playerRef.current.seekTo(nextTime, true);
            setCurrentTime(nextTime);
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

    const list = [50, 200];

    return (
        <section className="display">
            <div className="video">
                <YouTube 
                    className="youtube"
                    videoId="W6_V19cf9hg" 
                    opts={opts} 
                    onReady={onReady} 
                />
                <div className="timeline">
                    <span className="time-left">{formatTime(currentTime)}</span>
                    <div className="progress-container">
                        <div className="progress"></div>
                        {list.map((time, i) => 
                            <div 
                                className="dot" 
                                key={i} 
                                style={{"left": time / duration * 100 + '%'}}
                                onClick={() => {
                                    if (playerRef.current) {
                                        playerRef.current.seekTo(time, true);
                                        setCurrentTime(time);
                                    }
                                }}
                            />
                        )}
                    </div>
                    <span className="time-right">{formatTime(duration)}</span>
                </div>
                <div className="control">
                    <button className="previous" onClick={goPrevious}>
                        <i className="fa-solid fa-backward-step"></i>
                    </button>
                    <button className="play-pause" onClick={handlePlayPause}>
                        <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`}></i>
                    </button>
                    <button className="next" onClick={goNext}>
                    <i className="fa-solid fa-forward-step"></i>
                    </button>
                </div>
            </div>
            <VideoInfo />
        </section>
  );
}