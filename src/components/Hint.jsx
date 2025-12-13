import React, { useState, useRef, useEffect } from 'react';

import { Send } from 'lucide-react';
import 'components/Hint.css';

export default function Hint() {
    const [messages, setMessages] = useState([{ id: 0, sender: 'ai', text: 'AI はまだ寝ている…' }]);
    const inputRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        const text = inputRef.current.value.trim();
        inputRef.current.value = '';
        if (text === '') return;

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text,
        };
        setMessages((prev) => [...prev, newMessage]);
        inputRef.current.textContent = '';
    };

    return (
        <section className='hint'>
            <div className='header'>AI 添削 (這裡做成筆記跟AI兩個分頁的hackMD式三種模式切換)</div>

            <div className='response' ref={chatRef}>
                {messages.map((msg) => (
                    <p key={msg.id} className={`bubble ${msg.sender}`}>
                        {msg.text}
                    </p>
                ))}
            </div>
            <form
                className='input-area'
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <input className='input' ref={inputRef} placeholder='メッセージを入力...'></input>
                <button className='send' onClick={sendMessage}>
                    <Send className='icon' size={20} fill />
                </button>
            </form>
        </section>
    );
}
