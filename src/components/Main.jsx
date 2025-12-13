import React from 'react';

import Display from 'components/Display';
import Hint from 'components/Hint';
import Nav from 'components/Nav';

import 'components/Main.css';

export default function Main() {
    return (
        <>
            <Nav />
            <main>
                <Display />
                <Hint />
            </main>
        </>
    );
}
