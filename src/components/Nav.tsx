import React from 'react';

import 'components/Nav.css';

interface NavProps {
    isReviewMode?: boolean;
}

export default function Nav({ isReviewMode = false }: NavProps) {
    return (
        <header className='nav'>
            <a className='nav-title' href='#main'>
                <img className='logo' src='images/icon.png' alt='Logo' />
                <span className='title'>せっさたくま</span>
            </a>

            <div className='nav-mode'>
                {isReviewMode ? 'レビューモード' : 'ディスカッションモード'}
            </div>
        </header>
    );
}
