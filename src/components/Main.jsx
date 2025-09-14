import React from 'react';

import Nav from 'components/Nav';
import Display from 'components/Display';
import Transcript from 'components/Transcript';
import Footer from 'components/Footer';

import 'components/Main.css';

export default function Main(props) {
    const [currentTime, setCurrentTime] = React.useState(0);
    return <>
        <Nav/>
        <main>
            <Display currentTime={currentTime} setCurrentTime={setCurrentTime}/>
            <Transcript currentTime={currentTime} setCurrentTime={setCurrentTime}/>
        </main>
        <Footer/>
    </>
}