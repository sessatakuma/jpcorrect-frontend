import React from "react";

import 'components/Nav.css';

export default function Nav() {
    return (
        <header className='nav'>
            <a className='nav-title' href="#main">
                <img className='logo' src='images/icon.png' alt='Logo' />
                <span className='title'>せっさたくま</span>
            </a>
            <div className='nav-buttons'>
                <button onClick={() => {console.log('中');}}>中</button>
                <button><i className="fa-solid fa-moon" /></button>
            </div>
        </header>
    );
}