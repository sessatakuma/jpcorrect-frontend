import React from 'react';

import Nav from 'components/Nav';
import Display from 'components/Display';
import Transcript from 'components/Transcript';
import Footer from 'components/Footer';

import 'components/Main.css';

export default function Main(props) {
    return <>
        <Nav/>
        <main>
            <Display/>
            <Transcript/>
        </main>
        <Footer/>
    </>
}