import React, { useState } from 'react';

import Display from 'components/Display';
import Hint from 'components/Hint';
import Nav from 'components/Nav';

import 'components/Main.css';

export default function Main() {
    const [mode, setMode] = useState('ai');
    return (
        <>
            <Nav mode={mode} />
            <main>
                <Display />
                <Hint />
            </main>
        </>
    );
}
