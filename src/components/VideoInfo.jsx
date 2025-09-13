import React from "react";
import 'components/VideoInfo.css';

export default function VideoInfo() {
    return (
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
                                {Array.from({ length: 8 }, (_, i) => i + 1).map((_, _index) => (
                                    <li className="participant" key={index * 8 + _index}>
                                        <img className="icon" src="https://yt3.ggpht.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s88-c-k-c0x00ffffff-no-rj" alt="Author Avatar"/>
                                        <span className="name">すい {index * 8 + _index + 1}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
    )
}