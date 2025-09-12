import React, { useRef } from "react";
import YouTube from "react-youtube";
import 'components/Display.css';

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
            <div className="info">
                <div className="video-info">
                    <h2 className="title">テーマ</h2>
                    ．
                    <span className="event-type">検討会</span>
                    ．
                    <span className="date">2024/01/01</span>
                </div>
                <div className="participant-info">
                    {[1, 2].map((_, index) => (
                        <div className="group" key={index}>
                            <h3 className="title">グループ{index + 1}</h3>
                            <ul className="participants">
                                {
                                    Array.from({ length: 8 }, (_, i) => i + 1).map((_, _index) => (
                                        <li className="participant" key={index * 8 + _index}>
                                            <img className="icon" src="https://yt3.ggpht.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s88-c-k-c0x00ffffff-no-rj" alt="Author Avatar"/>
                                            <span className="name">星街すいせい {index * 8 + _index + 1}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
  );
}