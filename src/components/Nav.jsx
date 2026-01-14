import React from 'react';

import 'components/Nav.css';

export default function Nav({ mode }) {
    const modeMap = {
        note: 'ノート',
        edit: '内容編集',
        ai: 'AI対話',
    };

    return (
        <header className='nav'>
            <a className='nav-title' href='#main'>
                <img className='logo' src='images/icon.png' alt='Logo' />
                <span className='title'>せっさたくま</span>
            </a>
            <div className='nav-mode'>{modeMap[mode]}</div>
        </header>
    );
}
