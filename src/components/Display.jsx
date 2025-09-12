import React, { useRef } from "react";
import YouTube from "react-youtube";
import 'components/Display.css';
import VideoInfo from "components/VideoInfo";

export default function Display() {
    const playerRef = useRef(null);

    const onReady = e => {
        playerRef.current = e.target;
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
                    <div className="progress"></div>
                    <div className="dot"/>
                    <div className="dot"/>
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