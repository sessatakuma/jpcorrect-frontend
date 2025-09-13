import React from "react";

import 'components/Hint.css';

export default function Hint() {
    return (
        <section className='hint'>
            <div className="header">AI 添削</div>
            <p className="response">AI はまだ寝ている…</p>
            <div className="input-area">
                <p className="input" contentEditable></p>
                <button className="send">
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </section>
    );
}