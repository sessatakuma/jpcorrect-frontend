import React from 'react';

import PropTypes from 'prop-types';
import 'components/Nav.css';

export default function Nav({ isReviewMode }) {
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

Nav.propTypes = {
    isReviewMode: PropTypes.bool.isRequired,
};

Nav.defaultProps = {
    isReviewMode: false,
};
