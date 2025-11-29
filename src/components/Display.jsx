import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';

import VideoInfo from 'components/VideoInfo';
import PropTypes from 'prop-types';
import 'components/Display.css';

Display.propTypes = {
    playerRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    currentTime: PropTypes.number.isRequired,
};

export default function Display({ playerRef, currentTime }) {
    const videoID = 'W6_V19cf9hg';
    const youtubeOpts = {
        playerVars: {
            controls: 0,
            autoplay: 0,
        },
    };

    const timestamps = [50, 150, 200, 325];

    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const progressRef = useRef(null);

    const onReady = (e) => {
        playerRef.current = e.target;
        setDuration(playerRef.current.getDuration());
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            const state = playerRef.current.getPlayerState();
            if (state === window.YT.PlayerState.PLAYING) {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
            } else {
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        }
    };

    const setTime = (time) => playerRef.current && playerRef.current.seekTo(time, true);

    const goPrevious = () => {
        if (!playerRef.current) return;

        let prevTimestamp = -1;
        for (let i = 0; i < timestamps.length; i++) {
            if (currentTime > timestamps[i]) prevTimestamp = i;
            else break;
        }
        setTime(prevTimestamp !== -1 ? timestamps[prevTimestamp] : 0);
    };

    const goNext = () => {
        if (!playerRef.current) return;

        const nextTime = timestamps.find((time) => time > currentTime);
        setTime(nextTime !== undefined ? nextTime : duration);
    };

    const changeTime = (e) => {
        if (!playerRef.current) return;

        const progressContainer = progressRef.current;
        if (!progressContainer || !duration) return;

        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let percent = x / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        const newTime = percent * duration;
        setTime(newTime);
    };

    const startChangingTime = () => {
        window.addEventListener('mousemove', changeTime);
        window.addEventListener('mouseup', finishChangingTime);
        playerRef.current.pauseVideo();
    };

    const finishChangingTime = () => {
        window.removeEventListener('mousemove', changeTime);
        window.removeEventListener('mouseup', finishChangingTime);
        playerRef.current.playVideo();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <section className='display'>
            <div className='video'>
                <YouTube
                    className='youtube'
                    videoId={videoID}
                    opts={youtubeOpts}
                    onReady={onReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
                <div className='timeline'>
                    <span className='time-left'>{formatTime(currentTime)}</span>
                    <div className='progress-container'>
                        <div
                            className='progress'
                            onClick={changeTime}
                            onMouseDown={startChangingTime}
                            ref={progressRef}
                        >
                            <div
                                className='progress-indicator'
                                style={{
                                    '--progress': `${(currentTime / duration) * 100}%`,
                                }}
                            ></div>
                        </div>
                        {timestamps.map((time, i) => (
                            <div
                                className='dot'
                                key={i}
                                style={{ left: (time / duration) * 100 + '%' }}
                                onClick={() => setTime(time)}
                            />
                        ))}
                    </div>
                    <span className='time-right'>{formatTime(duration)}</span>
                </div>
                <div className='control'>
                    <button className='previous' onClick={goPrevious}>
                        <i className='fa-solid fa-backward-step'></i>
                    </button>
                    <button className='play-pause' onClick={handlePlayPause}>
                        <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`}></i>
                    </button>
                    <button className='next' onClick={goNext}>
                        <i className='fa-solid fa-forward-step'></i>
                    </button>
                </div>
            </div>
            <VideoInfo />
        </section>
    );
}
