import React from "react";
import 'components/VideoInfo.css';

export default function VideoInfo() {
    const groupCount = 1;
    return (
        <div className="info">
                <div className="video-info">
                    <h2 className="title">テーマ</h2>
                    <span className="dot">．</span>
                    <span className="event-type">検討会</span>
                    <span className="dot">．</span>
                    <span className="date">2024/06/02</span>
                </div>
                <div className="participant-info">
                    {Array.from({ length: groupCount }, (_, i) => i + 1).map((_, index) => (
                        <div className="group" key={index}>
                            <h3 className="title">{groupCount == 1 ? '発表者' : ('グループ' + (index + 1))}</h3>
                            <ul className="participants">
                                {Array.from({ length: 1 }, (_, i) => i + 1).map((_, _index) => (
                                    <li className="participant" key={index * 8 + _index}>
                                        <img className="icon" src="images/icon.png" alt="Author Avatar"/>
                                        <span className="name">6UC</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
    )
}