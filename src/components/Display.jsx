import React from "react";

import 'components/Display.css';

export default function Display() {
    return (
        <section className='display'>
            <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/3DrYQMK4hJE?si=rJKkERmEbyvmvH1N" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen/>
        </section>
    );
}